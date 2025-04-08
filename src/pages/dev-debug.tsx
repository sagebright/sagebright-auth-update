// src/pages/dev-debug.tsx

import React, { useEffect, useState } from 'react';
import { getUsers } from '@/lib/backendApi';
import { getDepartments } from '@/lib/backendApi';
import { useAuth } from '@/contexts/auth/AuthContext';

export default function DevDebugPage() {
  const { userId, currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
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
        const usersData = await getUsers();
        setUsers(usersData);
  
        const orgRes = await fetch('http://localhost:5050/api/orgs', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });
        const orgJson = await orgRes.json();
        setOrgs(orgJson.data || []);
  
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);

        const roadmapRes = await fetch('http://localhost:5050/api/roadmaps', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });
        const roadmapJson = await roadmapRes.json();
        setRoadmaps(roadmapJson.data || []);
        
        
      } catch (err) {
        console.error('Failed to load debug data', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEverything();
  }, [accessToken]); // ✅ This makes it re-run when the token is set
  
  
  

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
