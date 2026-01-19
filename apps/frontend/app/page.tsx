import { Plus, Clock, CheckCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#37352f]">Welcome back, User</h1>
          <p className="text-gray-500 mt-1">Manage your email campaigns efficiently.</p>
        </div>
        <Link
          href="/schedule"
          className="flex items-center gap-2 bg-[#2383E2] hover:bg-[#1a6bbd] text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors w-fit"
        >
          <Plus size={16} />
          New Email
        </Link>
      </div>

      {/* Stats / Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-md border border-[#ECECEC] bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock size={16} />
            <span className="text-sm font-medium">Scheduled</span>
          </div>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="p-4 rounded-md border border-[#ECECEC] bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Sent</span>
          </div>
          <p className="text-2xl font-bold">1,240</p>
        </div>
        {/* Placeholder for future stat */}
        <div className="p-4 rounded-md border border-[#ECECEC] bg-gray-50 border-dashed flex items-center justify-center text-gray-400 text-sm">
          Upcoming Feature
        </div>
      </div>


      {/* Recent Jobs Table - Notion Style */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#37352f] flex items-center gap-2">
          Recent Activity
          <span className="text-xs font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Coming Soon</span>
        </h2>

        <div className="border border-[#ECECEC] rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F7F7F5] text-gray-500 font-medium border-b border-[#ECECEC]">
                <tr>
                  <th className="px-4 py-3 min-w-[200px]">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Scheduled For</th>
                  <th className="px-4 py-3 w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC]">
                {/* Placeholder Rows */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-3 font-medium text-[#37352f]">Weekly Newsletter #42</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">Tomorrow at 9:00 AM</td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-3 font-medium text-[#37352f]">Welcome Onboarding</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Sent
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">Today at 2:30 PM</td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Empty State visual if needed */}
          {/* <div className="p-8 text-center text-gray-400 text-sm">No emails found.</div> */}
        </div>
      </div>
    </div>
  );
}
