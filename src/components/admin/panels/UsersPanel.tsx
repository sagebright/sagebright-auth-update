
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';
import { UserFormPanel } from './UserFormPanel';
import { UserTable, UserTableRow } from '../UserTable';
import { UserTableFilters } from '../UserTableFilters';
import { EmptyState } from '../EmptyState';
import { SectionWrapper } from '../SectionWrapper';
import { BulkActions } from '../BulkActions';
import { StatsRow } from '../StatsRow';

const mockUsers: UserTableRow[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Software Engineer',
    department: 'Engineering',
    daysRemaining: 10,
    percentComplete: 75,
    startDate: '2025-03-01',
    status: 'in-progress'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    role: 'Product Manager',
    department: 'Product',
    daysRemaining: 0,
    percentComplete: 100,
    startDate: '2025-02-15',
    status: 'completed'
  },
  {
    id: '3',
    name: 'Michael Brown',
    role: 'Marketing Specialist',
    department: 'Marketing',
    daysRemaining: 30,
    percentComplete: 25,
    startDate: '2025-04-01',
    status: 'not-started'
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'HR Coordinator',
    department: 'HR',
    daysRemaining: -5,
    percentComplete: 60,
    startDate: '2025-03-10',
    status: 'overdue'
  },
  {
    id: '5',
    name: 'James Wilson',
    role: 'Sales Representative',
    department: 'Sales',
    daysRemaining: 20,
    percentComplete: 40,
    startDate: '2025-03-20',
    status: 'in-progress'
  },
  {
    id: '6',
    name: 'Jennifer Moore',
    role: 'Financial Analyst',
    department: 'Finance',
    daysRemaining: 5,
    percentComplete: 85,
    startDate: '2025-03-05',
    status: 'in-progress'
  }
];

export function UsersPanel() {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [users, setUsers] = useState<UserTableRow[]>(mockUsers);
  const [filters, setFilters] = useState({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleFilterChange = (newFilters: any) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
    
    // For the demo, we'll just log the filters and keep the original data
    // In a real app, this would filter the data based on the criteria
    // setUsers(filteredUsers);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  if (isAddingUser) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => setIsAddingUser(false)}
          >
            Back to Users
          </Button>
        </div>
        <UserFormPanel />
      </div>
    );
  }

  // Stats for the users section
  const userStats = [
    {
      title: "Total Users",
      value: "1,274",
      icon: Users,
      change: "+12% from last month"
    },
    {
      title: "Active Users",
      value: "892",
      icon: UserCheck,
      change: "+5% from last month"
    },
    {
      title: "New Users",
      value: "45",
      icon: UserPlus,
      change: "+16% from last month"
    },
    {
      title: "Inactive Users",
      value: "382",
      icon: UserX,
      change: "-3% from last month"
    }
  ];

  return (
    <SectionWrapper
      title="Users"
      description="Manage user accounts and onboarding processes"
      id="users-section"
    >
      {/* Summary Cards */}
      <StatsRow stats={userStats} />
      
      {/* User Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all users in your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setIsAddingUser(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <UserTableFilters onFilterChange={handleFilterChange} />
            
            {users.length > 0 ? (
              <>
                <BulkActions
                  selectedItems={selectedUsers}
                  onSelectAll={handleSelectAll}
                  allSelected={selectedUsers.length === users.length && users.length > 0}
                  onClearSelection={clearSelection}
                  totalItems={users.length}
                />
                
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <Checkbox 
                            checked={selectedUsers.length === users.length && users.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Days Remaining</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Progress</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b">
                          <td className="p-4 align-middle">
                            <Checkbox 
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleSelectUser(user.id)}
                            />
                          </td>
                          <td className="p-4 align-middle">{user.name}</td>
                          <td className="p-4 align-middle">{user.role}</td>
                          <td className="p-4 align-middle">{user.daysRemaining} days</td>
                          <td className="p-4 align-middle">{user.percentComplete}%</td>
                          <td className="p-4 align-middle">{user.status}</td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <EmptyState
                icon={Users}
                title="No users yet"
                description="You can create a user to get started with onboarding and user management."
                actionLabel="Create User"
                onAction={() => setIsAddingUser(true)}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
