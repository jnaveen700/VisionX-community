function Resources() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Learning Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Getting Started</h3>
          <p className="text-gray-600">Essential resources for beginners</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Web Development</h3>
          <p className="text-gray-600">HTML, CSS, JavaScript tutorials</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Backend Development</h3>
          <p className="text-gray-600">Node.js, Express, MongoDB guides</p>
        </div>
      </div>
    </div>
  )
}

export default Resources
