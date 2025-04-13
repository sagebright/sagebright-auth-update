
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Tag, Edit2, Save, X, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface TagProps {
  id: string;
  name: string;
  color: string;
  department: string;
  visibility: 'public' | 'internal' | 'private';
  count: number;
}

export const TagManagement: React.FC = () => {
  const [tags, setTags] = useState<TagProps[]>([
    { id: '1', name: 'HR', color: 'info', department: 'Human Resources', visibility: 'public', count: 15 },
    { id: '2', name: 'Onboarding', color: 'success', department: 'Human Resources', visibility: 'internal', count: 23 },
    { id: '3', name: 'Finance', color: 'warning', department: 'Finance', visibility: 'private', count: 8 },
    { id: '4', name: 'Policy', color: 'info', department: 'Legal', visibility: 'internal', count: 19 },
    { id: '5', name: 'Training', color: 'success', department: 'All', visibility: 'public', count: 31 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState<TagProps | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('info');
  const [tagDepartment, setTagDepartment] = useState('');
  const [tagVisibility, setTagVisibility] = useState<'public' | 'internal' | 'private'>('public');

  const departments = ['Human Resources', 'Finance', 'Legal', 'IT', 'Marketing', 'Operations', 'All'];
  const colorOptions = [
    { value: 'info', label: 'Blue' },
    { value: 'success', label: 'Green' },
    { value: 'warning', label: 'Orange' },
    { value: 'destructive', label: 'Red' },
    { value: 'secondary', label: 'Gray' },
  ];

  const filteredTags = tags
    .filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(tag => selectedDepartment === 'all' || tag.department === selectedDepartment);

  const handleAddNewTag = () => {
    setCurrentTag(null);
    setTagName('');
    setTagColor('info');
    setTagDepartment('Human Resources');
    setTagVisibility('public');
    setDialogOpen(true);
  };

  const handleEditTag = (tag: TagProps) => {
    setCurrentTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setTagDepartment(tag.department);
    setTagVisibility(tag.visibility);
    setDialogOpen(true);
  };

  const handleDeleteTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleSaveTag = () => {
    if (!tagName.trim()) return;

    if (currentTag) {
      // Edit existing tag
      setTags(tags.map(tag => 
        tag.id === currentTag.id 
          ? { ...tag, name: tagName, color: tagColor, department: tagDepartment, visibility: tagVisibility }
          : tag
      ));
    } else {
      // Add new tag
      const newTag: TagProps = {
        id: Date.now().toString(),
        name: tagName,
        color: tagColor,
        department: tagDepartment,
        visibility: tagVisibility,
        count: 0
      };
      setTags([...tags, newTag]);
    }
    setDialogOpen(false);
  };

  const getTagVariant = (color: string) => {
    switch (color) {
      case 'info': return 'info';
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'destructive': return 'destructive';
      case 'secondary': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tag Management</CardTitle>
              <CardDescription>Create and manage document tags</CardDescription>
            </div>
            <Button onClick={handleAddNewTag}>
              <Plus className="h-4 w-4 mr-2" /> Add New Tag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                className="px-3 py-2 border rounded-md"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Tags List */}
            <div className="border rounded-md">
              <div className="grid grid-cols-12 bg-muted px-4 py-2 text-sm font-medium">
                <div className="col-span-3">Tag Name</div>
                <div className="col-span-3">Department</div>
                <div className="col-span-2">Visibility</div>
                <div className="col-span-2 text-center">Documents</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              <div className="divide-y">
                {filteredTags.length > 0 ? (
                  filteredTags.map(tag => (
                    <div key={tag.id} className="grid grid-cols-12 px-4 py-3 items-center">
                      <div className="col-span-3 flex items-center">
                        <Badge variant={getTagVariant(tag.color)} className="mr-2">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag.name}
                        </Badge>
                      </div>
                      <div className="col-span-3 text-sm">{tag.department}</div>
                      <div className="col-span-2 text-sm">
                        {tag.visibility === 'public' && (
                          <span className="flex items-center text-xs"><Eye className="h-3 w-3 mr-1" /> Public</span>
                        )}
                        {tag.visibility === 'internal' && (
                          <span className="flex items-center text-xs"><Eye className="h-3 w-3 mr-1" /> Internal</span>
                        )}
                        {tag.visibility === 'private' && (
                          <span className="flex items-center text-xs"><EyeOff className="h-3 w-3 mr-1" /> Private</span>
                        )}
                      </div>
                      <div className="col-span-2 text-center text-sm">
                        {tag.count}
                      </div>
                      <div className="col-span-2 flex justify-end space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditTag(tag)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteTag(tag.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No tags found. Create your first tag to get started.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Tag Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentTag ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tag Name</label>
              <Input
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tag Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <Badge
                    key={color.value}
                    variant={color.value as any}
                    className={`cursor-pointer ${tagColor === color.value ? 'ring-2 ring-offset-2' : ''}`}
                    onClick={() => setTagColor(color.value)}
                  >
                    {color.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={tagDepartment}
                onChange={(e) => setTagDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Visibility</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={tagVisibility}
                onChange={(e) => setTagVisibility(e.target.value as any)}
              >
                <option value="public">Public (All Users)</option>
                <option value="internal">Internal (Employees Only)</option>
                <option value="private">Private (Admins Only)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTag}>
              <Save className="h-4 w-4 mr-2" />
              {currentTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
