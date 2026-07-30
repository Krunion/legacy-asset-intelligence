import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  archived: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  on_hold: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const FACILITY_TYPES = [
  "Hospital / Medical Center",
  "Office Building",
  "Manufacturing Plant",
  "Warehouse / Distribution Center",
  "School / University",
  "Government Building",
  "Data Center",
  "Retail / Commercial",
  "Laboratory / Research Facility",
  "Military / Defense",
  "Residential Complex",
  "Mixed Use",
  "Other",
];

const INDUSTRIES = [
  "Healthcare",
  "Manufacturing",
  "Information Technology",
  "Government",
  "Education",
  "Financial Services",
  "Energy / Utilities",
  "Transportation / Logistics",
  "Retail / Wholesale",
  "Construction",
  "Defense / Aerospace",
  "Telecommunications",
  "Real Estate",
  "Hospitality",
  "Other",
];

export default function AssetProjects() {
  const [, navigate] = useLocation();
  const [showCreate, setShowCreate] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingProjectId, setPendingProjectId] = useState<number | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [setPasswordProjectId, setSetPasswordProjectId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Create form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    clientName: "",
    clientContact: "",
    clientEmail: "",
    clientPhone: "",
    facilityType: "",
    industry: "",
    squareFootage: "",
    numberOfFloors: "",
    numberOfBuildings: "",
    yearBuilt: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    projectScope: "",
    startDate: "",
    endDate: "",
    estimatedBudget: "",
    notes: "",
    projectManager: "",
    teamSize: "",
    password: "",
  });

  const projectsQuery = trpc.assets.listProjects.useQuery();
  const isAdminQuery = trpc.assets.isProjectAdmin.useQuery();
  const createMutation = trpc.assets.createProject.useMutation({
    onSuccess: (data) => {
      projectsQuery.refetch();
      setShowCreate(false);
      resetForm();
      navigate(`/assets/${data.id}`);
    },
  });
  const deleteMutation = trpc.assets.deleteProject.useMutation({
    onSuccess: () => projectsQuery.refetch(),
  });
  const verifyPasswordMutation = trpc.assets.verifyProjectPassword.useMutation({
    onSuccess: () => {
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPasswordError("");
      if (pendingProjectId) navigate(`/assets/${pendingProjectId}`);
    },
    onError: (err) => {
      setPasswordError(err.message || "Incorrect password");
    },
  });
  const setPasswordMutation = trpc.assets.setProjectPassword.useMutation({
    onSuccess: () => {
      setShowSetPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      projectsQuery.refetch();
    },
  });
  const removePasswordMutation = trpc.assets.removeProjectPassword.useMutation({
    onSuccess: () => projectsQuery.refetch(),
  });

  const isAdmin = isAdminQuery.data?.isAdmin || false;

  function resetForm() {
    setForm({
      name: "", description: "", clientName: "", clientContact: "",
      clientEmail: "", clientPhone: "", facilityType: "", industry: "",
      squareFootage: "", numberOfFloors: "", numberOfBuildings: "", yearBuilt: "",
      location: "", address: "", city: "", state: "", zipCode: "",
      country: "United States", projectScope: "", startDate: "", endDate: "",
      estimatedBudget: "", notes: "", projectManager: "", teamSize: "", password: "",
    });
  }

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCreate() {
    if (!form.name.trim()) return;
    createMutation.mutate({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      clientName: form.clientName.trim() || undefined,
      clientContact: form.clientContact.trim() || undefined,
      clientEmail: form.clientEmail.trim() || undefined,
      clientPhone: form.clientPhone.trim() || undefined,
      facilityType: form.facilityType || undefined,
      industry: form.industry || undefined,
      squareFootage: form.squareFootage ? parseInt(form.squareFootage) : undefined,
      numberOfFloors: form.numberOfFloors ? parseInt(form.numberOfFloors) : undefined,
      numberOfBuildings: form.numberOfBuildings ? parseInt(form.numberOfBuildings) : undefined,
      yearBuilt: form.yearBuilt ? parseInt(form.yearBuilt) : undefined,
      location: form.location.trim() || undefined,
      address: form.address.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state.trim() || undefined,
      zipCode: form.zipCode.trim() || undefined,
      country: form.country.trim() || undefined,
      projectScope: form.projectScope.trim() || undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      estimatedBudget: form.estimatedBudget ? parseFloat(form.estimatedBudget) : undefined,
      notes: form.notes.trim() || undefined,
      projectManager: form.projectManager.trim() || undefined,
      teamSize: form.teamSize ? parseInt(form.teamSize) : undefined,
      password: form.password.trim() || undefined,
    });
  }

  function handleProjectClick(projectId: number, hasPassword: boolean) {
    if (hasPassword && !isAdmin) {
      setPendingProjectId(projectId);
      setShowPasswordPrompt(true);
      setPasswordInput("");
      setPasswordError("");
    } else {
      navigate(`/assets/${projectId}`);
    }
  }

  function handleVerifyPassword() {
    if (!pendingProjectId || !passwordInput.trim()) return;
    verifyPasswordMutation.mutate({ projectId: pendingProjectId, password: passwordInput });
  }

  function handleSetPassword(projectId: number) {
    setSetPasswordProjectId(projectId);
    setNewPassword("");
    setConfirmPassword("");
    setShowSetPassword(true);
  }

  function handleSavePassword() {
    if (!setPasswordProjectId || !newPassword.trim()) return;
    if (newPassword !== confirmPassword) return;
    setPasswordMutation.mutate({ projectId: setPasswordProjectId, password: newPassword });
  }

  function handleRemovePassword(projectId: number) {
    if (confirm("Remove password protection from this project? All team members will have direct access.")) {
      removePasswordMutation.mutate({ projectId });
    }
  }

  function handleDelete(id: number, projectName: string) {
    if (confirm(`Are you sure you want to permanently delete "${projectName}" and ALL its assets? This cannot be undone.`)) {
      deleteMutation.mutate({ id });
    }
  }

  const projects = projectsQuery.data || [];

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d1d35]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/employee-portal")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Asset Management</h1>
              <p className="text-sm text-gray-400">Select a project or create a new one</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Project
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Password Prompt Modal */}
        {showPasswordPrompt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0d1d35] border border-white/10 rounded-xl w-full max-w-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white">Project Password Required</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">Enter the project password to access this project.</p>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyPassword()}
                placeholder="Enter password..."
                className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none mb-2"
                autoFocus
              />
              {passwordError && <p className="text-sm text-red-400 mb-3">{passwordError}</p>}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => { setShowPasswordPrompt(false); setPasswordInput(""); setPasswordError(""); }}
                  className="px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPassword}
                  disabled={!passwordInput.trim() || verifyPasswordMutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {verifyPasswordMutation.isPending ? "Verifying..." : "Enter Project"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Set Password Modal (Admin Only) */}
        {showSetPassword && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0d1d35] border border-white/10 rounded-xl w-full max-w-sm p-6">
              <h2 className="text-lg font-bold text-white mb-4">Set Project Password</h2>
              <p className="text-sm text-gray-400 mb-4">Team members will need this password to access the project.</p>
              <div className="space-y-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password..."
                  className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  autoFocus
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password..."
                  className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-red-400">Passwords do not match</p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowSetPassword(false)}
                  className="px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  disabled={!newPassword.trim() || newPassword !== confirmPassword || setPasswordMutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {setPasswordMutation.isPending ? "Saving..." : "Set Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Project Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0d1d35] border border-white/10 rounded-xl w-full max-w-3xl p-6 my-8">
              <h2 className="text-xl font-bold text-white mb-6">Create New Project</h2>

              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                {/* Project Name & Description */}
                <div className="border-b border-white/5 pb-5">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Project Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Project Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        placeholder="e.g., City Hospital Q3 Asset Audit"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => updateForm("description", e.target.value)}
                        placeholder="Brief description of this project scope and objectives..."
                        rows={3}
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Project Manager</label>
                        <input
                          type="text"
                          value={form.projectManager}
                          onChange={(e) => updateForm("projectManager", e.target.value)}
                          placeholder="Lead manager name"
                          className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Team Size</label>
                        <input
                          type="number"
                          value={form.teamSize}
                          onChange={(e) => updateForm("teamSize", e.target.value)}
                          placeholder="# of team members"
                          className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div className="border-b border-white/5 pb-5">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Client Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Client / Organization Name</label>
                      <input
                        type="text"
                        value={form.clientName}
                        onChange={(e) => updateForm("clientName", e.target.value)}
                        placeholder="Client organization"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Primary Contact</label>
                      <input
                        type="text"
                        value={form.clientContact}
                        onChange={(e) => updateForm("clientContact", e.target.value)}
                        placeholder="Contact person name"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Client Email</label>
                      <input
                        type="email"
                        value={form.clientEmail}
                        onChange={(e) => updateForm("clientEmail", e.target.value)}
                        placeholder="client@example.com"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Client Phone</label>
                      <input
                        type="tel"
                        value={form.clientPhone}
                        onChange={(e) => updateForm("clientPhone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Facility / Site Demographics */}
                <div className="border-b border-white/5 pb-5">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Facility / Site Demographics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Facility Type</label>
                      <select
                        value={form.facilityType}
                        onChange={(e) => updateForm("facilityType", e.target.value)}
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="">Select facility type...</option>
                        {FACILITY_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
                      <select
                        value={form.industry}
                        onChange={(e) => updateForm("industry", e.target.value)}
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="">Select industry...</option>
                        {INDUSTRIES.map((i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Square Footage</label>
                      <input
                        type="number"
                        value={form.squareFootage}
                        onChange={(e) => updateForm("squareFootage", e.target.value)}
                        placeholder="Total sq ft"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Number of Floors</label>
                      <input
                        type="number"
                        value={form.numberOfFloors}
                        onChange={(e) => updateForm("numberOfFloors", e.target.value)}
                        placeholder="# floors"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Number of Buildings</label>
                      <input
                        type="number"
                        value={form.numberOfBuildings}
                        onChange={(e) => updateForm("numberOfBuildings", e.target.value)}
                        placeholder="# buildings"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Year Built</label>
                      <input
                        type="number"
                        value={form.yearBuilt}
                        onChange={(e) => updateForm("yearBuilt", e.target.value)}
                        placeholder="e.g., 1995"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Location / Address */}
                <div className="border-b border-white/5 pb-5">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Location / Address</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Site Name / Location</label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => updateForm("location", e.target.value)}
                        placeholder="e.g., Main Campus, Building A"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                        placeholder="123 Main Street"
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => updateForm("city", e.target.value)}
                          placeholder="City"
                          className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={(e) => updateForm("state", e.target.value)}
                          placeholder="ST"
                          className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ZIP</label>
                        <input
                          type="text"
                          value={form.zipCode}
                          onChange={(e) => updateForm("zipCode", e.target.value)}
                          placeholder="ZIP"
                          className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                      <input
                        type="text"
                        value={form.country}
                        onChange={(e) => updateForm("country", e.target.value)}
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Scope & Timeline */}
                <div className="border-b border-white/5 pb-5">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Project Scope & Timeline</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Project Scope</label>
                      <textarea
                        value={form.projectScope}
                        onChange={(e) => updateForm("projectScope", e.target.value)}
                        placeholder="Describe the scope of work, deliverables, and objectives..."
                        rows={3}
                        className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={form.startDate}
                          onChange={(e) => updateForm("startDate", e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                        <input
                          type="date"
                          value={form.endDate}
                          onChange={(e) => updateForm("endDate", e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Estimated Budget</label>
                        <input
                          type="number"
                          value={form.estimatedBudget}
                          onChange={(e) => updateForm("estimatedBudget", e.target.value)}
                          placeholder="$0.00"
                          className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="border-b border-white/5 pb-5">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Additional Notes</h3>
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateForm("notes", e.target.value)}
                    placeholder="Any additional notes, special instructions, or requirements..."
                    rows={3}
                    className="w-full px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Password (Admin Only) */}
                {isAdmin && (
                  <div>
                    <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Project Password (Admin Only)
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">Set a password that team members must enter to access this project. Leave blank for no password.</p>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      placeholder="Set project password (optional)"
                      className="w-full px-3 py-2 bg-[#0a1628] border border-amber-500/20 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => { setShowCreate(false); resetForm(); }}
                  className="px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!form.name.trim() || createMutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Create Project"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projectsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0d1d35]/60 border border-white/5 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/5 rounded w-full mb-2" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create your first asset management project to start tracking equipment, inventory, and resources.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const hasPassword = !!project.passwordHash;
              return (
                <div
                  key={project.id}
                  className="bg-[#0d1d35]/60 border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-all cursor-pointer group relative"
                  onClick={() => handleProjectClick(project.id, hasPassword)}
                >
                  {/* Admin controls */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      {hasPassword ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemovePassword(project.id); }}
                          className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg"
                          title="Remove password"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSetPassword(project.id); }}
                          className="p-1.5 text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg"
                          title="Set password"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.name); }}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                        title="Delete project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors pr-16">
                      {project.name}
                    </h3>
                  </div>

                  {/* Password indicator */}
                  {hasPassword && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-xs text-amber-400">Password Protected</span>
                    </div>
                  )}

                  {project.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[project.status] || STATUS_COLORS.active}`}>
                      {project.status.replace("_", " ").toUpperCase()}
                    </span>
                    {project.industry && (
                      <span className="text-xs text-gray-500">{project.industry}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                    <div>
                      <p className="text-xs text-gray-500">Assets</p>
                      <p className="text-lg font-bold text-white">{project.assetCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Value</p>
                      <p className="text-lg font-bold text-emerald-400">
                        ${Number(project.totalValue || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {project.clientName && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-xs text-gray-500">Client</p>
                      <p className="text-sm text-gray-300">{project.clientName}</p>
                    </div>
                  )}

                  {(project.city || project.state) && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        {[project.city, project.state].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
