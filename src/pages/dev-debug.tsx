// src/pages/dev-debug.tsx

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api/apiClient';
import { useAuth } from '@/contexts/auth/AuthContext';
import { fetchUserContext } from '@/lib/fetchUserContext';
import { fetchOrgContext } from '@/lib/fetchOrgContext';
import { buildSageContext } from '@/lib/context/buildSageContext';

export default function DevDebugPage() {
  const { userId, currentUser, orgId } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [directUserContext, setDirectUserContext] = useState<any>(null);
  const [directOrgContext, setDirectOrgContext] = useState<any>(null);
  const [fullContext, setFullContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();
  console.log("🧪 accessToken from context:", accessToken);


  useEffect(() => {
    if (!accessToken) {
      console.warn("Token not yet available — delaying fetch");
      return;
    }
  
    const fetchEverything = async () => {
      try {
        // Use API request with mocks for development
        const usersResponse = await apiRequest('/users', {}, {
          context: 'dev debug users',
          useMockInDev: true
        });
        setUsers(usersResponse.data || []);
  
        // Local API calls with mock data in development
        const orgResponse = await apiRequest('/orgs', {}, {
          context: 'dev debug orgs',
          useMockInDev: true
        });
        setOrgs(orgResponse.data || []);
  
        const departmentsResponse = await apiRequest('/departments', {}, {
          context: 'dev debug departments',
          useMockInDev: true
        });
        setDepartments(departmentsResponse.data || []);

        const roadmapsResponse = await apiRequest('/roadmaps', {}, {
          context: 'dev debug roadmaps',
          useMockInDev: true
        });
        setRoadmaps(roadmapsResponse.data || []);
        
        // Test direct context fetching
        if (userId) {
          try {
            console.log("🧪 Testing direct user context fetch");
            const userContext = await fetchUserContext(userId);
            setDirectUserContext(userContext);
          } catch (error) {
            console.error("Error fetching user context directly:", error);
          }
        }
        
        if (orgId) {
          try {
            console.log("🧪 Testing direct org context fetch");
            const orgContext = await fetchOrgContext(orgId);
            setDirectOrgContext(orgContext);
          } catch (error) {
            console.error("Error fetching org context directly:", error);
          }
        }
        
        if (userId && orgId) {
          try {
            console.log("🧪 Testing full context build");
            const sageContext = await buildSageContext(userId, orgId, currentUser?.user_metadata?.org_slug, currentUser);
            setFullContext(sageContext);
          } catch (error) {
            console.error("Error building full context:", error);
          }
        }
        
      } catch (err) {
        console.error('Failed to load debug data', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEverything();
  }, [accessToken, userId, orgId, currentUser]); 
  
  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-charcoal">🔍 Dev Debug</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-2">🧑‍💻 Current User</h2>
            <pre className="bg-white p-4 rounded shadow text-sm overflow-auto">
              {JSON.stringify(currentUser, null, 2)}
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">🔍 Direct Context Testing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">User Context (Direct Fetch)</h3>
                <pre className="bg-white p-4 rounded shadow text-sm overflow-auto h-64">
                  {directUserContext 
                    ? JSON.stringify(directUserContext, null, 2) 
                    : "No user context found - check console for errors"}
                </pre>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Org Context (Direct Fetch)</h3>
                <pre className="bg-white p-4 rounded shadow text-sm overflow-auto h-64">
                  {directOrgContext 
                    ? JSON.stringify(directOrgContext, null, 2) 
                    : "No org context found - check console for errors"}
                </pre>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">🔄 Full Sage Context</h2>
            <pre className="bg-white p-4 rounded shadow text-sm overflow-auto">
              {fullContext 
                ? JSON.stringify(fullContext, null, 2) 
                : "Context build failed - check console for errors"}
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">👥 All Users</h2>
            <pre className="bg-white p-4 rounded shadow text-sm overflow-auto">
              {JSON.stringify(users, null, 2)}
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">🏢 Orgs</h2>
            <pre className="bg-white p-4 rounded shadow text-sm overflow-auto">
              {JSON.stringify(orgs, null, 2)}
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">🏢 Departments</h2>
            <pre className="bg-white p-4 rounded shadow text-sm overflow-auto">
              {JSON.stringify(departments, null, 2)}
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">🏢 Roadmaps</h2>
            <pre className="bg-white p-4 rounded shadow text-sm overflow-auto">
              {JSON.stringify(roadmaps, null, 2)}
            </pre>
          </section>
        </>
      )}
    </div>
  );
}
