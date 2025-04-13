import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';
import { UserFormPanel } from './UserFormPanel';
import { UserTable, UserTableRow } from '../UserTable';
import { UserTableFilters } from '../UserTableFilters';

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

  const handleFilterChange = (newFilters: any) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
    
    // For the demo, we'll just log the filters and keep the original data
    // In a real app, this would filter the data based on the criteria
    // setUsers(filteredUsers);
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,274</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+16% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">382</div>
            <p className="text-xs text-muted-foreground">-3% from last month</p>
          </CardContent>
        </Card>
      </div>
      
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
            
            <UserTable users={users} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
