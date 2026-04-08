import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

export const TeamsSection = () => {
  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    // ✅ UPDATED 2026 TEAMS
    const demoTeams = [
      { id: 'redbull', name: 'Red Bull Racing' },
      { id: 'mercedes', name: 'Mercedes' },
      { id: 'ferrari', name: 'Ferrari' },
      { id: 'mclaren', name: 'McLaren' },
      { id: 'aston', name: 'Aston Martin' },
      { id: 'alpine', name: 'Alpine' },
      { id: 'haas', name: 'Haas' },
      { id: 'williams', name: 'Williams' },
      { id: 'rb', name: 'Racing Bulls' },
      { id: 'audi', name: 'Audi' },
      { id: 'cadillac', name: 'Cadillac' }
    ];

    // ✅ UPDATED 2026 DRIVERS
    const demoDrivers = [
      { id: 1, name: 'Max Verstappen', team: 'redbull' },
      { id: 2, name: 'Isack Hadjar', team: 'redbull' },

      { id: 3, name: 'George Russell', team: 'mercedes' },
      { id: 4, name: 'Kimi Antonelli', team: 'mercedes' },

      { id: 5, name: 'Charles Leclerc', team: 'ferrari' },
      { id: 6, name: 'Lewis Hamilton', team: 'ferrari' },

      { id: 7, name: 'Lando Norris', team: 'mclaren' },
      { id: 8, name: 'Oscar Piastri', team: 'mclaren' },

      { id: 9, name: 'Fernando Alonso', team: 'aston' },
      { id: 10, name: 'Lance Stroll', team: 'aston' },

      { id: 11, name: 'Pierre Gasly', team: 'alpine' },
      { id: 12, name: 'Franco Colapinto', team: 'alpine' },

      { id: 13, name: 'Esteban Ocon', team: 'haas' },
      { id: 14, name: 'Oliver Bearman', team: 'haas' },

      { id: 15, name: 'Carlos Sainz', team: 'williams' },
      { id: 16, name: 'Alex Albon', team: 'williams' },

      { id: 17, name: 'Liam Lawson', team: 'rb' },
      { id: 18, name: 'Arvid Lindblad', team: 'rb' },

      { id: 19, name: 'Nico Hulkenberg', team: 'audi' },
      { id: 20, name: 'Gabriel Bortoleto', team: 'audi' },

      { id: 21, name: 'Sergio Perez', team: 'cadillac' },
      { id: 22, name: 'Valtteri Bottas', team: 'cadillac' }
    ];

    setTeams(demoTeams);
    setDrivers(demoDrivers);
  }, []);

  // ✅ FILTER FIXED
  const filteredDrivers = selectedTeam
    ? drivers.filter(d => d.team === selectedTeam)
    : drivers;

  return (
    <section id="teams" className="section bg-black">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl mb-4">
            TEAMS & DRIVERS
          </h2>
        </div>

        {/* ✅ FILTER BUTTONS */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">

          <button
            onClick={() => setSelectedTeam(null)}
            className={`px-4 py-2 text-sm ${
              selectedTeam === null
                ? 'bg-[#E10600] text-white'
                : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            All Teams
          </button>

          {teams.map(team => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`px-4 py-2 text-sm ${
                selectedTeam === team.id
                  ? 'bg-[#E10600] text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {team.name}
            </button>
          ))}
        </div>

        {/* ✅ DRIVERS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredDrivers.map(driver => (
            <div key={driver.id} className="f1-card p-4 text-center">
              <div className="font-display text-lg">
                {driver.name}
              </div>
            </div>
          ))}
        </div>

        {/* NEXT BUTTON */}
        <div className="flex justify-end mt-10">
          <button className="text-[#E10600] flex items-center gap-2">
            Next <ChevronRight />
          </button>
        </div>

      </div>
    </section>
  );
};