
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { 
  User, 
  Calendar, 
  Tag, 
  Building2, 
  Users, 
  BookOpen, 
  FileText, 
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';

// Form schema with validation
const userFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  role: z.string().min(1, { message: 'Please select a role' }),
  startDate: z.date({ required_error: 'Please select a start date' }),
  department: z.string().min(1, { message: 'Please select a department' }),
  supervisor: z.string().min(1, { message: 'Please select a supervisor' }),
  tags: z.array(z.string()).min(0),
  onboardingStatus: z.boolean().default(false),
  onboardingPath: z.string().optional(),
  adminNotes: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// Sample data for dropdowns - replace with actual API data in a real implementation
const ROLES = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
];

const DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' },
];

const SUPERVISORS = [
  { value: 'john.doe', label: 'John Doe' },
  { value: 'jane.smith', label: 'Jane Smith' },
  { value: 'mike.johnson', label: 'Mike Johnson' },
  { value: 'sarah.williams', label: 'Sarah Williams' },
];

const ONBOARDING_PATHS = [
  { value: 'standard', label: 'Standard' },
  { value: 'technical', label: 'Technical' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'custom', label: 'Custom' },
];

const TAG_OPTIONS = [
  { value: 'new-hire', label: 'New Hire' },
  { value: 'remote', label: 'Remote' },
  { value: 'part-time', label: 'Part-Time' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'intern', label: 'Intern' },
  { value: 'senior', label: 'Senior' },
];

interface UserFormProps {
  user?: UserFormValues;
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isLoading = false }: UserFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(user?.tags || []);
  
  // Initialize form with default values or existing user data
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user || {
      name: '',
      email: '',
      role: '',
      startDate: new Date(),
      department: '',
      supervisor: '',
      tags: [],
      onboardingStatus: false,
      onboardingPath: '',
      adminNotes: '',
    },
  });

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(current => 
      current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag]
    );
    
    const currentTags = form.getValues('tags');
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    form.setValue('tags', newTags, { shouldValidate: true });
  };

  // Handle form submission
  const handleSubmit = (data: UserFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Enter full name" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role Field */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date Field */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department Field */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Department</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <Building2 className="mr-2 h-4 w-4" />
                        {field.value
                          ? DEPARTMENTS.find(
                              (department) => department.value === field.value
                            )?.label
                          : "Select department"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search department..." />
                      <CommandEmpty>No department found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {DEPARTMENTS.map((department) => (
                            <CommandItem
                              key={department.value}
                              value={department.value}
                              onSelect={() => {
                                form.setValue("department", department.value);
                              }}
                            >
                              {department.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Supervisor Field */}
          <FormField
            control={form.control}
            name="supervisor"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Supervisor</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {field.value
                          ? SUPERVISORS.find(
                              (supervisor) => supervisor.value === field.value
                            )?.label
                          : "Select supervisor"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search supervisor..." />
                      <CommandEmpty>No supervisor found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {SUPERVISORS.map((supervisor) => (
                            <CommandItem
                              key={supervisor.value}
                              value={supervisor.value}
                              onSelect={() => {
                                form.setValue("supervisor", supervisor.value);
                              }}
                            >
                              {supervisor.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags Field */}
          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            selectedTags.length === 0 && "text-muted-foreground"
                          )}
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          {selectedTags.length > 0
                            ? `${selectedTags.length} selected`
                            : "Select tags"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {TAG_OPTIONS.map((tag) => (
                              <CommandItem
                                key={tag.value}
                                value={tag.value}
                                onSelect={() => toggleTag(tag.value)}
                              >
                                <div className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  selectedTags.includes(tag.value)
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}>
                                  <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <span>{tag.label}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTags.map(tag => {
                      const tagLabel = TAG_OPTIONS.find(t => t.value === tag)?.label || tag;
                      return (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tagLabel}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => toggleTag(tag)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Onboarding Status */}
          <FormField
            control={form.control}
            name="onboardingStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Onboarding Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    {field.value ? 'Completed' : 'In Progress'}
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Onboarding Path */}
          <FormField
            control={form.control}
            name="onboardingPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Onboarding Path</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <BookOpen className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select onboarding path" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ONBOARDING_PATHS.map((path) => (
                      <SelectItem key={path.value} value={path.value}>
                        {path.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Admin Notes */}
        <FormField
          control={form.control}
          name="adminNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Notes</FormLabel>
              <FormControl>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea 
                    placeholder="Enter any additional notes about this user" 
                    className="pl-10 min-h-[120px]" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            loadingText="Saving..."
          >
            Save User
          </Button>
        </div>
      </form>
    </Form>
  );
}
