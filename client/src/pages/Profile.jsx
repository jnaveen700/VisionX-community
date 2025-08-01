function Profile() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold">User Name</h1>
            <p className="text-gray-600">Beginner Developer</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-bold">Points</h3>
            <p>0</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-bold">Questions</h3>
            <p>0</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-bold">Projects</h3>
            <p>0</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 px-3 py-1 rounded">Add your skills</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Badges</h2>
            <p className="text-gray-600">No badges earned yet. Start participating to earn badges!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
