import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Flag, ChevronRight, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const TeamsSection = () => {
  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, updateProgress, addBookmark, removeBookmark, isBookmarked } = useAuth();
  const isCompleted = user?.progress?.teams;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, teamsRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/f1/drivers`),
          axios.get(`${BACKEND_URL}/api/f1/teams`)
        ]);
        setDrivers(driversRes.data);
        setTeams(teamsRes.data);
      } catch (error) {
        console.error('Error fetching F1 data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkComplete = () => {
    if (user) {
      updateProgress('teams', !isCompleted);
    }
  };

  const handleBookmark = (type, id) => {
    if (!user) return;
    if (isBookmarked(type, id)) {
      removeBookmark(type, id);
    } else {
      addBookmark(type, id);
    }
  };

  const scrollToNext = () => {
    document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredDrivers = selectedTeam 
    ? drivers.filter(d => d.team === selectedTeam)
    : drivers;

  if (loading) {
    return (
      <section id="teams" className="section bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-zinc-800 w-48 mx-auto mb-4" />
            <div className="h-12 bg-zinc-800 w-96 mx-auto mb-8" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="teams" 
      data-testid="teams-section"
      className="section bg-black"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600]/10 border border-[#E10600]/30 mb-6">
            <span className="w-6 h-6 flex items-center justify-center bg-[#E10600] text-white font-bold text-xs">3</span>
            <span className="label text-[#E10600]">Meet the Competitors</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            TEAMS & DRIVERS
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            11 teams, 22 drivers competing for glory
          </p>
        </div>

        {/* Simple explanation */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <div className="f1-card p-6 text-center">
            <div className="font-display text-5xl text-[#E10600] mb-2">10</div>
            <div className="text-sm text-zinc-400">Constructor Teams</div>
            <div className="text-xs text-zinc-600 mt-1">Design & build their own cars</div>
          </div>
          <div className="f1-card p-6 text-center">
            <div className="font-display text-5xl text-[#E10600] mb-2">20</div>
            <div className="text-sm text-zinc-400">Drivers on the Grid</div>
            <div className="text-xs text-zinc-600 mt-1">2 drivers per team</div>
          </div>
        </div>

        {/* Teams Quick View */}
        <div className="mb-8">
          <div className="label text-zinc-500 mb-4">
            The 11 Teams
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTeam(null)}
              data-testid="team-filter-all"
              className={`px-4 py-2 text-sm transition-all ${
                selectedTeam === null
                  ? 'bg-[#E10600] text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              All
            </button>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
                data-testid={`team-filter-${team.id}`}
                className={`px-4 py-2 text-sm transition-all border ${
                  selectedTeam === team.id
                    ? 'text-white border-current'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border-white/10'
                }`}
                style={{
                  backgroundColor: selectedTeam === team.id ? team.color : undefined,
                  borderColor: selectedTeam === team.id ? team.color : undefined
                }}
              >
                {team.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Drivers Grid - Simplified */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-12">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              data-testid={`driver-card-${driver.number}`}
              className="f1-card p-4 relative group"
            >
              {/* Team Color */}
              <div 
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: driver.team_color }}
              />
              
              {/* Number */}
              <div 
                className="font-display text-3xl opacity-20 absolute top-2 right-2"
                style={{ color: driver.team_color }}
              >
                {driver.number}
              </div>
              
              {/* Info */}
              <div className="pt-2">
                <div className="font-display text-lg leading-tight">
                  {driver.name.split(' ').slice(-1)[0]}
                </div>
                <div className="text-xs text-zinc-500 truncate">
                  {driver.team_name?.split(' ')[0]}
                </div>
              </div>

              {/* Bookmark */}
              {user && (
                <button
                  onClick={() => handleBookmark('driver', driver.id)}
                  data-testid={`bookmark-driver-${driver.id}`}
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-[#E10600]"
                >
                  {isBookmarked('driver', driver.id) ? (
                    <BookmarkCheck size={16} className="text-[#E10600]" />
                  ) : (
                    <Bookmark size={16} />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Key Takeaway */}
        <div className="bg-zinc-900/50 border border-white/5 p-6 text-center mb-8">
          <div className="label text-[#E10600] mb-2">Key Takeaway</div>
          <p className="text-white">
            Each team has 2 drivers who compete together as teammates but also against each other
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {user && (
            <button
              onClick={handleMarkComplete}
              data-testid="teams-complete-btn"
              className={`flex items-center gap-2 px-4 py-2 border transition-all text-sm ${
                isCompleted 
                  ? 'border-green-500 text-green-500' 
                  : 'border-white/20 text-zinc-400 hover:border-[#E10600] hover:text-[#E10600]'
              }`}
            >
              <Flag size={14} />
              {isCompleted ? 'Completed' : 'Mark as Learned'}
            </button>
          )}
          
          <button
            onClick={scrollToNext}
            data-testid="teams-next-btn"
            className="ml-auto flex items-center gap-2 text-[#E10600] hover:gap-3 transition-all"
          >
            <span className="text-sm uppercase tracking-wider">Next: Rules & Flags</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
