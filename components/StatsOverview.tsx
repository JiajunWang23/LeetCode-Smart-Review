import React from 'react';
import { UserStats } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#2cbb5d', '#ffc01e', '#ef4743']; // Easy, Medium, Hard

export const StatsOverview: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const data = [
    { name: 'Easy', value: stats.easySolved },
    { name: 'Medium', value: stats.mediumSolved },
    { name: 'Hard', value: stats.hardSolved },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1: The Numbers */}
        <div className="bg-lc-black border border-lc-gray rounded-2xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-lc-gray/50 flex items-center justify-center text-2xl font-bold border border-lc-gray">
                    {stats.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{stats.username}</h2>
                    <p className="text-gray-400 text-sm">Global Ranking: {stats.ranking || 'N/A'}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-lc-green/5 rounded-lg border border-lc-green/10">
                    <div className="text-2xl font-bold text-lc-green">{stats.easySolved}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Easy</div>
                </div>
                <div className="p-3 bg-lc-yellow/5 rounded-lg border border-lc-yellow/10">
                    <div className="text-2xl font-bold text-lc-yellow">{stats.mediumSolved}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Medium</div>
                </div>
                <div className="p-3 bg-lc-red/5 rounded-lg border border-lc-red/10">
                    <div className="text-2xl font-bold text-lc-red">{stats.hardSolved}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Hard</div>
                </div>
            </div>

             <div className="mt-6">
                <h4 className="text-sm text-gray-400 mb-2">Detected Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                    {stats.topSkills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-lc-gray text-xs rounded text-gray-300">
                            {skill}
                        </span>
                    ))}
                </div>
             </div>
        </div>

        {/* Card 2: The Chart */}
        <div className="bg-lc-black border border-lc-gray rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4 w-full text-left">Difficulty Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#282828', borderColor: '#3e3e3e', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
             <div className="text-center mt-2">
                <span className="text-3xl font-bold text-white">{stats.totalSolved}</span>
                <span className="text-sm text-gray-500 ml-2">Total Solved</span>
            </div>
        </div>
    </div>
  );
};