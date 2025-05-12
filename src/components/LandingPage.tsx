import { Link } from 'react-router-dom';

<div className="flex justify-center space-x-4 mt-6">
  <Link to="/parent/dashboard" className="inline-flex items-center px-4 py-2 bg-brightpair text-white font-medium rounded-md hover:bg-brightpair-600 transition-colors">
    <span>Parent Dashboard</span>
  </Link>
  <Link to="/tutor/dashboard" className="inline-flex items-center px-4 py-2 bg-brightpair text-white font-medium rounded-md hover:bg-brightpair-600 transition-colors">
    <span>Tutor Dashboard</span>
  </Link>
</div> 