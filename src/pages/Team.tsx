import React, { useState, useEffect } from 'react';
import Team from '@/components/Team';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db'; // Import db

const Team2Page = () => {
  const [activeTeam, setActiveTeam] = useState<string>('gudauta'); // State for active team
  // const [teams, setTeams] = useState<any[]>([]); // State for list of teams (тип any, если не используется)
  
  // Placeholder state and effect for Team2 specific data based on activeTeam
  // Replace with actual data fetching logic for Team2 if needed
  const [team2Data, setTeam2Data] = useState<any>(null);

  useEffect(() => {
    // Load teams data from SQLite
    const loadTeams = async () => {
      try {
        // Cast the result to the TeamType expected by TeamHeader
        const teamsData = await db.getTeams(); 
        // setTeams(teamsData);
      } catch (error) {
        console.error('Error loading teams:', error);
      }
    };
    loadTeams();
  }, []);
  
  useEffect(() => {
    // Load data specific to Team2 based on activeTeam
    // Replace with actual data fetching logic for Team2
    const loadTeam2Data = async () => {
      if (activeTeam) {
        console.log(`Fetching data for team: ${activeTeam}`);
        // Example: Fetch data from db or API based on activeTeam
        // const data = await db.getTeam2Data(activeTeam);
        // setTeam2Data(data);
      }
    };
    loadTeam2Data();
  }, [activeTeam]);

  // const handleTeamChange = (teamId: string) => {
  //   setActiveTeam(teamId);
  //   // You might want to reset other state here if needed for Team2
  // };

  // const currentTeam = teams.find(team => team.id === activeTeam);
  // const primaryColor = currentTeam?.primaryColor || '#000000';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 page-transition">
        {/* Team2 component - pass activeTeamId if needed for component logic */}
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Pass activeTeamId to Team2 if its content depends on the selected team */}
          <Team />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Team2Page; 