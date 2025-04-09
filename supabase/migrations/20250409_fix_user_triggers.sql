
-- Drop existing triggers and functions if they exist to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved function to handle new user creation with better logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _result RECORD;
  _role TEXT;
BEGIN
  -- Get role from metadata or default to 'user'
  _role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  
  -- Insert the new user into the public.users table
  INSERT INTO public.users (
    id,
    created_at,
    email,
    full_name,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    NEW.created_at,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    _role
  )
  RETURNING * INTO _result;
  
  -- Log the role assignment
  INSERT INTO public.role_sync_log (
    user_id,
    new_role
  ) VALUES (
    NEW.id,
    _role
  );
  
  -- Also ensure auth metadata has the role
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('role', _role)
      ELSE
        raw_user_meta_data || jsonb_build_object('role', _role)
    END
  WHERE id = NEW.id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log any errors to a table for debugging
  INSERT INTO public.role_sync_log (
    user_id,
    old_role,
    new_role,
    error
  ) VALUES (
    NEW.id,
    NULL,
    _role,
    SQLERRM
  );
  
  -- Don't block user creation even if our trigger fails
  RETURN NEW;
END;
$$;

-- Create the trigger to run after a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to manually run the sync for existing users
CREATE OR REPLACE FUNCTION public.sync_existing_users()
RETURNS SETOF TEXT
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _user RECORD;
  _role TEXT;
  _result TEXT;
BEGIN
  FOR _user IN SELECT * FROM auth.users LOOP
    -- Get role from metadata or default to 'user'
    _role := COALESCE(_user.raw_user_meta_data->>'role', 'user');
    
    -- Check if user exists in public.users
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = _user.id) THEN
      -- Insert user
      INSERT INTO public.users (
        id,
        created_at,
        email,
        full_name,
        avatar_url,
        role
      ) VALUES (
        _user.id,
        _user.created_at,
        _user.email,
        _user.raw_user_meta_data->>'full_name',
        _user.raw_user_meta_data->>'avatar_url',
        _role
      );
      
      -- Log sync
      INSERT INTO public.role_sync_log (
        user_id,
        new_role
      ) VALUES (
        _user.id,
        _role
      );
      
      _result := 'Created user record for ' || _user.id;
      RETURN NEXT _result;
    ELSE
      _result := 'User ' || _user.id || ' already exists';
      RETURN NEXT _result;
    END IF;
  END LOOP;
  
  RETURN;
END;
$$;
