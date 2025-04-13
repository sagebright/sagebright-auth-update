
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type UserOnboardingStatus = 'completed' | 'in-progress' | 'not-started' | 'overdue';

export interface UserTableRow {
  id: string;
  name: string;
  role: string;
  department: string;
  daysRemaining: number;
  percentComplete: number;
  startDate: string;
  status: UserOnboardingStatus;
}

interface UserTableProps {
  users: UserTableRow[];
  selectedUsers?: string[];
  onSelectUser?: (userId: string) => void;
  onSelectAll?: () => void;
}

const statusColors = {
  'completed': 'bg-green-100 text-green-800 hover:bg-green-200',
  'in-progress': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'not-started': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  'overdue': 'bg-red-100 text-red-800 hover:bg-red-200',
};

export const UserTable: React.FC<UserTableProps> = ({ 
  users,
  selectedUsers = [],
  onSelectUser = () => {},
  onSelectAll = () => {}
}) => {
  const navigate = useNavigate();

  const handleRowClick = (userId: string) => {
    navigate(`/admin-dashboard/users/edit/${userId}`);
  };

  const allSelected = selectedUsers.length === users.length && users.length > 0;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Days Remaining</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead aria-label="Actions"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user.id} 
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onSelectUser(user.id)}
                  aria-label={`Select ${user.name}`}
                />
              </TableCell>
              <TableCell className="font-medium" onClick={() => handleRowClick(user.id)}>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  {user.name}
                </div>
              </TableCell>
              <TableCell onClick={() => handleRowClick(user.id)}>{user.role}</TableCell>
              <TableCell onClick={() => handleRowClick(user.id)}>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {user.daysRemaining > 0 ? `${user.daysRemaining} days` : 'Overdue'}
                </div>
              </TableCell>
              <TableCell onClick={() => handleRowClick(user.id)}>
                <div className="flex items-center gap-2">
                  <Progress value={user.percentComplete} className="h-2 w-24" />
                  <span className="text-xs text-muted-foreground">{user.percentComplete}%</span>
                </div>
              </TableCell>
              <TableCell onClick={() => handleRowClick(user.id)}>
                <Badge className={statusColors[user.status] || ''}>
                  {user.status.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell onClick={() => handleRowClick(user.id)}>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
