import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#E6EEF4]">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center text-[#004B87] mb-8">
          PCI Quality Organization Dashboard
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-lg mb-6 text-[#002D56]">
            A web-based dashboard to visualize, manage, and plan the reorganization of PCI's quality department across multiple focus factories.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#F1F1F1] p-4 rounded-md">
              <h2 className="text-xl font-semibold text-[#004B87] mb-2">Organization Structure</h2>
              <p className="text-[#707070]">View and manage the quality department organization across multiple focus factories.</p>
            </div>
            
            <div className="bg-[#F1F1F1] p-4 rounded-md">
              <h2 className="text-xl font-semibold text-[#004B87] mb-2">Timeline Builder</h2>
              <p className="text-[#707070]">Create and manage implementation phases and activities.</p>
            </div>
            
            <div className="bg-[#F1F1F1] p-4 rounded-md">
              <h2 className="text-xl font-semibold text-[#004B87] mb-2">Budget Analysis</h2>
              <p className="text-[#707070]">Analyze staffing costs and budget allocation across focus factories.</p>
            </div>
            
            <div className="bg-[#F1F1F1] p-4 rounded-md">
              <h2 className="text-xl font-semibold text-[#004B87] mb-2">Resource Management</h2>
              <p className="text-[#707070]">Calculate required headcount based on work order inputs.</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link 
              href="/dashboard" 
              className="bg-[#81C341] hover:bg-[#6ba235] text-white font-bold py-2 px-6 rounded-md transition-colors"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
