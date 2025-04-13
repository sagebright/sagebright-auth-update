
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FilePlus, FolderOpen, FileSearch } from 'lucide-react';
import { DocumentUpload } from '../DocumentUpload';
import { TagManagement } from '../TagManagement';

export function DocumentsPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-6">
      {!isUploading ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">436</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Recent Uploads</CardTitle>
                <FilePlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">+32% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Searches</CardTitle>
                <FileSearch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">192</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Document Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">All Documents</TabsTrigger>
              <TabsTrigger value="tags">Tags & Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Document Management</CardTitle>
                      <CardDescription>Upload, organize and manage all documents.</CardDescription>
                    </div>
                    <Button onClick={() => setIsUploading(true)}>
                      <FilePlus className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex justify-end items-center">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Filter</Button>
                      <Button variant="outline" size="sm">Sort</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-8 flex justify-center items-center">
                    <div className="text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Documents Table Placeholder</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        This is a placeholder for the document management table that would display document titles, categories, upload dates, and actions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tags" className="space-y-4">
              <TagManagement />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <DocumentUpload 
          onSave={(data) => {
            console.log('Document data:', data);
            setIsUploading(false);
          }}
          onCancel={() => setIsUploading(false)}
        />
      )}
    </div>
  );
}
