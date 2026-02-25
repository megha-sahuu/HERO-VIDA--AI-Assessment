import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../hooks/useReports';
import { useUI } from '../context/UIContext';


import {
  Calendar, ArrowRight, Shield, Zap, Plus, Cuboid, Bike
} from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';
import Onboarding from '../features/onboarding/components/Onboarding';
import Skeleton from '../components/common/Skeleton';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const { openScanModal } = useUI();
  const { data: reports = [], isLoading: isLoadingReports } = useReports(user?.id);

  // Take last 3 reports (assuming API returns chronological, otherwise sort might be needed but for now slice is fine)
  const displayedReports = reports.slice(0, 3);
  const showSeeAll = reports.length > 3;





  const stats = [
    { label: 'Total Scans', value: reports.length.toString(), icon: Cuboid },
    { label: 'Credit Balance', value: user?.credits.toString() || '0', icon: Zap },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">

      {/* Header section with Greeting and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        {/* Header Content */}
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500">
            Overview
          </h1>
          <p className="text-zinc-500 mt-1">Manage your fleet and assessments.</p>
        </div>

      </div>

      {/* Main Grid Layout (Bento Grid) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        <button
          onClick={openScanModal}
          className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-[2rem] bg-gradient-to-br from-[#2b0080] via-[#3a0088] to-[#1c0033] text-white p-8 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden shadow-xl shadow-brand-900/20"
        >

          {/* Cubic Grind/Pattern Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-5"></div>

          {/* New Watermark Logo */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 text-brand-700/20 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 group-hover:text-brand-600/30 transition-all duration-500 pointer-events-none">
            <Bike className="w-full h-full stroke-[1px]" />
          </div>

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center py-4">
            <div className="absolute top-0 left-0 w-16 h-16 rounded-[1.25rem] bg-white text-black flex items-center justify-center shadow-lg group-hover:rotate-90 transition-transform duration-500">
              <Plus className="w-8 h-8" />
            </div>

            <div className="mt-6 mb-8">
              <h2 className="text-5xl sm:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight">
                <span className="text-white block">Start</span>
                <span className="text-[#888888] block">Assessment</span>
              </h2>
              <p className="text-brand-200/90 mt-4 max-w-sm text-lg font-medium mx-auto px-4 leading-relaxed">
                AI-powered damage analysis and<br />cost estimation.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <span className="px-6 py-3 bg-white text-[#2b0080] rounded-xl text-sm font-bold shadow-md hover:bg-zinc-100 transition-colors">
                Launch Scanner
              </span>
              <div className="w-12 h-12 rounded-xl bg-[#6b00d6] flex items-center justify-center group-hover:bg-[#8800eb] transition-colors shadow-md">
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </button>

        {/* 2. Stats Cubes */}
        {stats.map((stat, i) => (
          <div key={i} className="col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between hover:border-black transition-colors group">
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 text-sm font-medium">{stat.label}</span>
              <stat.icon className="w-5 h-5 md:w-8 md:h-8 text-zinc-300 group-hover:text-black transition-colors" />
            </div>
            <div className="mt-4">
              {isLoadingReports ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-bold text-zinc-900">{stat.value}</span>
              )}
            </div>
          </div>
        ))}

        {/* 3. Recent History Cubes (Fill remaining grid) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 mt-4">
          <h3 className="font-bold text-lg text-zinc-900 mb-4 flex items-center gap-2">
            <Cuboid className="w-5 h-5" />
            Recent Assessments
          </h3>

          {isLoadingReports ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col h-[300px]">
                  <Skeleton className="h-[200px] w-full" />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-12 text-center border-dashed">
              <p className="text-zinc-400">No assessments found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => navigate(`/report/${report.id}`)}
                  className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-xl transition-all cursor-pointer flex flex-col"
                >
                  {/* Image Area */}
                  <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                    <img src={report.imageUrl} alt={report.vehicleType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
                      {formatCurrency(report.totalEstimatedCost)}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-zinc-900 truncate">{report.vehicleType}</h4>
                      {/* <span className="text-xs text-zinc-400 font-mono">#{report.id.slice(0,4)}</span> */}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4 mt-auto">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(report.timestamp).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {report.damages.length} issues</span>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-sm group-hover:text-black transition-colors">
                      <span className="font-medium text-zinc-500 group-hover:text-black">View Details</span>
                      <ArrowRight className="w-4 h-4 -ml-2 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all text-black" />
                    </div>
                  </div>
                </div>
              ))}

              {/* See All Card */}
              {showSeeAll && (
                <button
                  onClick={() => navigate('/assessments')}
                  className="group bg-zinc-50 border border-zinc-200 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-center"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-black transition-colors" />
                  </div>
                  <span className="font-bold text-zinc-900">View All Assessments</span>
                  <span className="text-sm text-zinc-500 mt-1">{reports.length - 3} more reports</span>

                </button>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Mandatory Onboarding Overlay */}
      {user && !user.hasCompletedOnboarding && (
        <Onboarding user={user} onComplete={() => { }} />
      )}
    </div>
  );
};

export default DashboardPage;
