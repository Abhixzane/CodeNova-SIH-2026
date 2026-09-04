import React, { useState, useEffect } from 'react';
import {
  Flag,
  AlertTriangle,
  FileCheck,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  Camera,
  Send,
  User,
  Shield,
  Filter,
  Search,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { HeritageConditionReport, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const HeritageReportingPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<HeritageConditionReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Report for Timeline Inspection
  const [selectedReport, setSelectedReport] = useState<HeritageConditionReport | null>(null);

  // New Report Form State
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [siteName, setSiteName] = useState<string>('Taj Mahal');
  const [city, setCity] = useState<string>('Agra');
  const [issueCategory, setIssueCategory] = useState<string>('ACCESSIBILITY_BARRIER');
  const [severity, setSeverity] = useState<string>('MEDIUM');
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Official Status Update State
  const [newStatus, setNewStatus] = useState<string>('IN_PROGRESS');
  const [statusNote, setStatusNote] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
      if (data.length > 0 && !selectedReport) {
        setSelectedReport(data[0]);
      }
    } catch (err) {
      console.error('Failed to load condition reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      const created = await api.createReport({
        site_id: siteName.toLowerCase().replace(/\s+/g, '-'),
        site_name: siteName,
        city,
        reported_by: user?.name || 'Verified Citizen Reporter',
        user_role: (user?.role as UserRole) || 'TRAVELLER',
        issue_category: issueCategory,
        severity,
        description,
        image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
      });

      setReports([created, ...reports]);
      setSelectedReport(created);
      setIsCreating(false);
      setDescription('');
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedReport) return;
    setUpdatingStatus(true);
    try {
      const updated = await api.updateReportStatus(
        selectedReport.id,
        newStatus,
        statusNote || `Condition status updated to ${newStatus}`,
        user?.name || 'ASI Conservation Officer'
      );

      setReports(reports.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedReport(updated);
      setStatusNote('');
    } catch (err) {
      console.error('Failed to update report status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch =
      r.site_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">Submitted</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">Under Review</span>;
      case 'VERIFIED':
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">Verified</span>;
      case 'ASSIGNED':
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">Assigned</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">In Progress</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Resolved</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-stone-100 text-stone-600">{status}</span>;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 uppercase">Critical</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-100 text-orange-800 uppercase">High</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 uppercase">Medium</span>;
      case 'LOW':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-stone-100 text-stone-700 uppercase">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-3">
              <Flag className="w-3.5 h-3.5" />
              <span>CITIZEN CONSERVATION & INTEGRITY TRACKER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Heritage Condition Reporting Portal
            </h1>
            <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
              Empowering travelers, licensed guides, and local residents to report facility breakdowns,
              accessibility obstacles, and preservation concerns directly to civic and archaeological authorities.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>File Condition Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by site name, city, or issue..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-500 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Split-View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Report List */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
              <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-stone-500">Loading verified reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
              <p className="text-xs text-stone-500">No condition reports found matching criteria.</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedReport?.id === report.id
                    ? 'bg-rose-50/50 border-rose-300 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-900">{report.site_name}</span>
                  {getStatusBadge(report.status)}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {getSeverityBadge(report.severity)}
                  <span className="text-[11px] font-semibold text-stone-500">
                    {report.issue_category.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                  <span>By {report.reported_by}</span>
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Detailed Timeline & Status Progression */}
        <div className="lg:col-span-7">
          {selectedReport ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-stone-500">{selectedReport.id}</span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs text-stone-500">{selectedReport.city}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-stone-900">{selectedReport.site_name}</h2>
                </div>

                <div className="flex items-center gap-2">
                  {getSeverityBadge(selectedReport.severity)}
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>

              {/* Description & Category Details */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Report Description
                </span>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {/* Incident Lifecycle Timeline */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>Official Remediation Timeline</span>
                </h3>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
                  {selectedReport.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-rose-600 flex items-center justify-center flex-shrink-0 z-10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex-1 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-900">{step.status.replace(/_/g, ' ')}</span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(step.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">{step.note}</p>
                        <span className="text-[10px] text-stone-500 font-semibold mt-1.5 block">
                          Actor: {step.actor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authorized Authority Action Simulation Panel */}
              <div className="p-5 bg-rose-50/40 rounded-xl border border-rose-200">
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-700" />
                  <span>Authority Lifecycle Action (Admin / Government Simulation)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="px-3 py-2 bg-white border border-rose-200 rounded-lg text-xs font-semibold text-stone-800"
                  >
                    <option value="UNDER_REVIEW">Progress to: Under Review</option>
                    <option value="VERIFIED">Progress to: Verified</option>
                    <option value="ASSIGNED">Progress to: Assigned</option>
                    <option value="IN_PROGRESS">Progress to: In Progress</option>
                    <option value="RESOLVED">Progress to: Resolved</option>
                  </select>

                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Action note (e.g. Work order issued)..."
                    className="px-3 py-2 bg-white border border-rose-200 rounded-lg text-xs text-stone-800 placeholder:text-stone-400"
                  />
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold"
                  >
                    {updatingStatus ? 'Updating...' : 'Log Remediation Action'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
              <p className="text-xs text-stone-500">Select a report on the left to view its remediation history.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Report Modal */}
      {isCreating && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs"
        >
          <div className="bg-white w-full max-w-lg rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Citizen Audit</span>
                <h2 className="text-lg font-bold text-stone-900">Report Monument Condition Issue</h2>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Monument or Site</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900"
                >
                  <option value="ACCESSIBILITY_BARRIER">Accessibility Barrier / Broken Ramp</option>
                  <option value="FACILITY_BREAKDOWN">Facility Breakdown (Water / Washroom)</option>
                  <option value="MISSING_SIGNAGE">Missing or Damaged Signage / Braille</option>
                  <option value="STRUCTURAL_DAMAGE">Structural Damage / Weathering</option>
                  <option value="WASTE_LITTER">Waste Accumulation / Litter</option>
                  <option value="LIGHTING_SAFETY">Lighting / Evening Safety Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Observation Details</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe the condition, exact location within monument grounds, and impact on visitors..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2 text-xs text-stone-600">
                <Camera className="w-4 h-4 text-stone-400" />
                <span>Geotagged image attachment will be bundled with submission</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Transmitting...' : 'Submit Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
