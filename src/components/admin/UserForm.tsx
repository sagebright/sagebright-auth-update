
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { OrgChartPreview } from './OrgChartPreview';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

const userFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  role: z.string().min(1, { message: 'Please select a role.' }),
  startDate: z.date({ required_error: 'Please select a start date.' }),
  department: z.string().optional(),
  supervisor: z.string().optional(),
  tags: z.array(z.string()).optional(),
  onboardingStatus: z.boolean().default(false),
  onboardingPath: z.string().optional(),
  adminNotes: z.string().optional()
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<UserFormValues>;
}

// Mock data for dropdowns
const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' }
];

const supervisorOptions = [
  { value: 'alex-smith', label: 'Alex Smith' },
  { value: 'maria-johnson', label: 'Maria Johnson' },
  { value: 'david-williams', label: 'David Williams' },
  { value: 'sarah-brown', label: 'Sarah Brown' },
  { value: 'james-davis', label: 'James Davis' }
];

const tagOptions = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'intern', label: 'Intern' },
  { value: 'leadership', label: 'Leadership' }
];

const onboardingPathOptions = [
  { value: 'standard', label: 'Standard (30 days)' },
  { value: 'accelerated', label: 'Accelerated (15 days)' },
  { value: 'extended', label: 'Extended (45 days)' },
  { value: 'executive', label: 'Executive (60 days)' },
  { value: 'technical', label: 'Technical (45 days)' }
];

export const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  onCancel,
  defaultValues = {
    startDate: new Date(),
    onboardingStatus: false,
    tags: []
  }
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues
  });

  const [selectedTags, setSelectedTags] = React.useState<string[]>(defaultValues.tags || []);
  const [selectedDepartment, setSelectedDepartment] = React.useState<string | undefined>(defaultValues.department);
  const [selectedSupervisor, setSelectedSupervisor] = React.useState<string | undefined>(defaultValues.supervisor);

  const handleTagSelection = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    form.setValue('tags', isSelected ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag]);
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
    form.setValue('tags', selectedTags.filter(t => t !== tag));
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    form.setValue('department', value);
  };

  const handleSupervisorChange = (value: string) => {
    setSelectedSupervisor(value);
    form.setValue('supervisor', value);
  };

  const getDepartmentLabel = (value?: string) => {
    if (!value) return 'Select department';
    return departmentOptions.find(option => option.value === value)?.label || value;
  };

  const getSupervisorLabel = (value?: string) => {
    if (!value) return 'Select supervisor';
    return supervisorOptions.find(option => option.value === value)?.label || value;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
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
            </div>
            
            {/* Department & Supervisor */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Department & Reporting</h3>
              
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
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {getDepartmentLabel(selectedDepartment)}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[300px]">
                        <Command>
                          <CommandInput placeholder="Search department..." />
                          <CommandEmpty>No department found.</CommandEmpty>
                          <CommandGroup>
                            {departmentOptions.map((dept) => (
                              <CommandItem
                                key={dept.value}
                                value={dept.value}
                                onSelect={handleDepartmentChange}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedDepartment === dept.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {dept.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {getSupervisorLabel(selectedSupervisor)}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[300px]">
                        <Command>
                          <CommandInput placeholder="Search supervisor..." />
                          <CommandEmpty>No supervisor found.</CommandEmpty>
                          <CommandGroup>
                            {supervisorOptions.map((sup) => (
                              <CommandItem
                                key={sup.value}
                                value={sup.value}
                                onSelect={handleSupervisorChange}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedSupervisor === sup.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {sup.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Org Chart Preview */}
              <OrgChartPreview 
                department={getDepartmentLabel(selectedDepartment)} 
                supervisor={getSupervisorLabel(selectedSupervisor)} 
              />
            </div>
            
            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tags</h3>
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>User Tags</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              selectedTags.length === 0 && "text-muted-foreground"
                            )}
                          >
                            {selectedTags.length > 0 ? `${selectedTags.length} tags selected` : "Select tags"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[300px]">
                        <Command>
                          <CommandInput placeholder="Search tags..." />
                          <CommandEmpty>No tags found.</CommandEmpty>
                          <CommandGroup>
                            {tagOptions.map((tag) => (
                              <CommandItem
                                key={tag.value}
                                value={tag.value}
                                onSelect={() => handleTagSelection(tag.value)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedTags.includes(tag.value)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {tag.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedTags.map(tag => {
                          const label = tagOptions.find(t => t.value === tag)?.label || tag;
                          return (
                            <Badge key={tag} variant="outline" className="flex items-center gap-1">
                              {label}
                              <button type="button" onClick={() => removeTag(tag)}>
                                <span className="sr-only">Remove {label} tag</span>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4 4L10 10M10 4L4 10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Onboarding Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Onboarding Information</h3>
              
              <FormField
                control={form.control}
                name="onboardingStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Onboarding Status</FormLabel>
                      <FormDescription>
                        Mark as active when onboarding is in progress
                      </FormDescription>
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
              
              <FormField
                control={form.control}
                name="onboardingPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onboarding Path</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an onboarding path" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {onboardingPathOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the appropriate onboarding timeline for this user
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              
              <FormField
                control={form.control}
                name="adminNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes about this user..."
                        className="resize-none h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      These notes are only visible to administrators
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save User</Button>
        </div>
      </form>
    </Form>
  );
};
