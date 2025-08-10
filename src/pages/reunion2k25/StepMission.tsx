import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';

export default function StepMission({ form, handleChange, handleBack, handleContinue }) {
  const [showCustomDegree, setShowCustomDegree] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Comprehensive list of subjects
  const subjects = [
    // Engineering Subjects
    "Computer Science Engineering", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering",
    "Electronics & Communication", "Information Technology", "Chemical Engineering", "Biotechnology",
    "Aeronautical Engineering", "Automobile Engineering", "Mining Engineering", "Metallurgical Engineering",
    "Textile Engineering", "Agricultural Engineering", "Food Technology", "Petroleum Engineering",
    "Environmental Engineering", "Industrial Engineering", "Production Engineering", "Instrumentation Engineering",
    
    // Medical Subjects
    "Medicine (MBBS)", "Dentistry (BDS)", "Ayurveda (BAMS)", "Homeopathy (BHMS)",
    "Physiotherapy", "Nursing", "Pharmacy", "Medical Lab Technology", "Radiology",
    "Optometry", "Occupational Therapy", "Speech Therapy", "Nutrition & Dietetics",
    
    // Science Subjects
    "Physics", "Chemistry", "Biology", "Mathematics", "Statistics", "Botany", "Zoology",
    "Microbiology", "Biochemistry", "Biotechnology", "Environmental Science", "Geology",
    "Geography", "Astronomy", "Oceanography", "Meteorology", "Forensic Science",
    
    // Commerce Subjects
    "Accounting", "Finance", "Marketing", "Human Resource Management", "Business Administration",
    "Economics", "Banking", "Insurance", "Taxation", "Auditing", "Investment Management",
    "International Business", "Supply Chain Management", "Retail Management", "Tourism Management",
    
    // Arts & Humanities
    "English Literature", "History", "Political Science", "Sociology", "Psychology",
    "Philosophy", "Economics", "Geography", "Anthropology", "Archaeology", "Linguistics",
    "Journalism", "Mass Communication", "Public Relations", "Advertising", "Film Studies",
    "Theatre Arts", "Music", "Fine Arts", "Dance", "Fashion Design", "Interior Design",
    
    // Law Subjects
    "Constitutional Law", "Criminal Law", "Civil Law", "Corporate Law", "Tax Law",
    "International Law", "Environmental Law", "Human Rights Law", "Intellectual Property Law",
    "Family Law", "Labour Law", "Cyber Law", "Banking Law", "Insurance Law",
    
    // Architecture & Design
    "Architecture", "Interior Design", "Urban Planning", "Landscape Architecture",
    "Product Design", "Graphic Design", "Industrial Design", "Fashion Design",
    "Textile Design", "Jewelry Design", "Ceramic Design", "Glass Design",
    
    // Computer Science & IT
    "Computer Science", "Information Technology", "Software Engineering", "Data Science",
    "Artificial Intelligence", "Machine Learning", "Cyber Security", "Network Engineering",
    "Database Management", "Web Development", "Mobile App Development", "Game Development",
    "Cloud Computing", "DevOps", "Blockchain Technology", "Internet of Things (IoT)",
    
    // Management Subjects
    "Business Administration", "Project Management", "Operations Management", "Strategic Management",
    "Financial Management", "Marketing Management", "Human Resource Management", "Quality Management",
    "Risk Management", "Change Management", "Innovation Management", "Knowledge Management",
    
    // Education Subjects
    "Elementary Education", "Secondary Education", "Special Education", "Physical Education",
    "Educational Psychology", "Curriculum Development", "Educational Technology", "Adult Education",
    "Early Childhood Education", "Educational Leadership", "Counseling", "Library Science",
    
    // Agriculture Subjects
    "Agriculture", "Horticulture", "Forestry", "Animal Husbandry", "Dairy Technology",
    "Food Technology", "Agricultural Economics", "Soil Science", "Plant Pathology",
    "Agricultural Engineering", "Veterinary Science", "Fisheries", "Sericulture",
    
    // Other Professional Courses
    "Hotel Management", "Catering Technology", "Travel & Tourism", "Event Management",
    "Sports Management", "Media Studies", "Animation", "VFX", "Gaming",
    "Digital Marketing", "Content Writing", "Translation", "Interpretation",
    "Social Work", "Public Administration", "Defense Studies", "Disaster Management",
    
    // Traditional & Alternative Medicine
    "Ayurveda", "Yoga", "Naturopathy", "Acupuncture", "Reiki", "Aromatherapy",
    "Herbal Medicine", "Traditional Chinese Medicine", "Unani Medicine", "Siddha Medicine",
    
    // Vocational & Technical
    "Automobile Technology", "Electronics", "Electrical", "Plumbing", "Carpentry",
    "Welding", "Machining", "Tool & Die Making", "Refrigeration", "Air Conditioning",
    "Beauty & Wellness", "Fashion Technology", "Textile Technology", "Printing Technology",
    
    // Research & Academic
    "Research Methodology", "Data Analysis", "Statistical Analysis", "Qualitative Research",
    "Quantitative Research", "Mixed Methods Research", "Action Research", "Case Study Research",
    "Survey Research", "Experimental Research", "Correlational Research", "Descriptive Research"
  ];

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(subject =>
    subject.toLowerCase().includes(subjectSearchTerm.toLowerCase())
  );

  // Check if we should show custom degree input
  useEffect(() => {
    const shouldShowCustom = form.education.curr_degree === 'Other' || isOtherSelected;
    setShowCustomDegree(shouldShowCustom);
  }, [form.education.curr_degree, isOtherSelected]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle degree selection change
  const handleDegreeChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setIsOtherSelected(true);
      setShowCustomDegree(true);
      // Clear the curr_degree field when "Other" is selected
      handleChange({ target: { name: 'education.curr_degree', value: '' } });
    } else if (value !== '') {
      // Only reset when a predefined option is selected (not empty)
      setIsOtherSelected(false);
      setShowCustomDegree(false);
      handleChange(e);
    } else {
      // Handle empty selection
      handleChange(e);
    }
  };

  // Handle custom degree input change
  const handleCustomDegreeChange = (e) => {
    handleChange(e);
    // Keep showing custom input as long as user is typing
    // Don't change isOtherSelected state when user is typing
  };

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    handleChange({ target: { name: 'education.current_class', value: subject } });
    setSubjectSearchTerm('');
    setShowSubjectDropdown(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.admit_year">Admit Year <span className="text-red-500">*</span></label>
          <select id="education.admit_year" name="education.admit_year" value={form.education.admit_year} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
            <option value="">Select</option>
            {Array.from({length: 2025-2007+1}, (_,i)=>2025-i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.admit_class">Admit Class <span className="text-red-500">*</span></label>
          <select id="education.admit_class" name="education.admit_class" value={form.education.admit_class} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
            <option value="">Select</option>
            {Array.from({length: 12-5+1}, (_,i)=>5+i).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.passout_year">Passout Year <span className="text-red-500">*</span></label>
          <select id="education.passout_year" name="education.passout_year" value={form.education.passout_year} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
            <option value="">Select</option>
            {Array.from({length: 2025-2007+1}, (_,i)=>2025-i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.last_class">Passout Class <span className="text-red-500">*</span></label>
          <select id="education.last_class" name="education.last_class" value={form.education.last_class} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
            <option value="">Select</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.curr_college">College/University <span className="text-red-500">*</span></label>
          <Input id="education.curr_college" name="education.curr_college" value={form.education.curr_college} onChange={handleChange} required placeholder="Enter college/university name" className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.curr_degree">Degree <span className="text-red-500">*</span></label>
          {showCustomDegree ? (
            <div className="relative">
              <Input 
                id="education.curr_degree" 
                name="education.curr_degree" 
                value={form.education.curr_degree} 
                onChange={handleCustomDegreeChange} 
                required 
                placeholder="Enter degree (e.g., B.Des, BHM, etc.)" 
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              />
              <button
                type="button"
                onClick={() => {
                  setIsOtherSelected(false);
                  setShowCustomDegree(false);
                  handleChange({ target: { name: 'education.curr_degree', value: '' } });
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Switch back to dropdown"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <select id="education.curr_degree" name="education.curr_degree" value={form.education.curr_degree} onChange={handleDegreeChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
              <option value="">Select</option>
              <option value="Engineering">Engineering</option>
              <option value="MBBS">MBBS</option>
              <option value="BDS">BDS</option>
              <option value="BAMS">BAMS</option>
              <option value="BHMS">BHMS</option>
              <option value="B.Tech">B.Tech</option>
              <option value="B.Sc">B.Sc</option>
              <option value="B.Com">B.Com</option>
              <option value="BBA">BBA</option>
              <option value="BCA">BCA</option>
              <option value="BA">BA</option>
              <option value="BFA">BFA</option>
              <option value="LLB">LLB</option>
              <option value="B.Arch">B.Arch</option>
              <option value="B.Pharm">B.Pharm</option>
              <option value="M.Tech">M.Tech</option>
              <option value="M.Sc">M.Sc</option>
              <option value="M.Com">M.Com</option>
              <option value="MBA">MBA</option>
              <option value="MCA">MCA</option>
              <option value="MA">MA</option>
              <option value="M.Arch">M.Arch</option>
              <option value="M.Pharm">M.Pharm</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
              <option value="ITI">ITI</option>
              <option value="Polytechnic">Polytechnic</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
              <option value="Science">Science</option>
              <option value="Other">Other</option>
            </select>
          )}
        </div>
      </div>
      

      <div className="relative">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.current_class">Subject/Field of Study</label>
        <div className="relative">
          <Input
            type="text"
            placeholder={form.education.current_class && form.education.current_class !== "UG" ? form.education.current_class : "Search for your subject..."}
            value={form.education.current_class && form.education.current_class !== "UG" ? "" : subjectSearchTerm}
            onChange={(e) => {
              if (!form.education.current_class || form.education.current_class === "UG") {
                setSubjectSearchTerm(e.target.value);
              }
            }}
            onFocus={() => {
              if (!form.education.current_class || form.education.current_class === "UG") {
                setShowSubjectDropdown(true);
              }
            }}
            onClick={() => {
              if (form.education.current_class && form.education.current_class !== "UG") {
                // Clear the selection and allow typing
                handleChange({ target: { name: 'education.current_class', value: 'UG' } });
                setSubjectSearchTerm('');
                setShowSubjectDropdown(true);
              }
            }}
            readOnly={form.education.current_class && form.education.current_class !== "UG"}
            className={`w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              form.education.current_class && form.education.current_class !== "UG" 
                ? "cursor-pointer bg-gray-50" 
                : "cursor-text"
            }`}
          />
          {form.education.current_class && form.education.current_class !== "UG" ? (
            <button
              type="button"
              onClick={() => {
                handleChange({ target: { name: 'education.current_class', value: 'UG' } });
                setSubjectSearchTerm('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}
        </div>
        {showSubjectDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto" ref={dropdownRef}>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSubjectSelect(subject)}
                >
                  {subject}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">No subjects found</div>
            )}
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-teal-700 mb-1.5">Currently Studying? <span className="text-red-500">*</span></label>
        <select id="currently_studying" name="education.study" value={form.education.study ? 'yes' : 'no'} onChange={e => handleChange({ target: { name: 'education.study', value: e.target.value === 'yes', type: 'checkbox', checked: e.target.value === 'yes' } })} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>      
      {form.education.study && (
        <>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.year_of_grad">Year of Graduation <span className="text-red-500">*</span></label>
            <select id="education.year_of_grad" name="education.year_of_grad" value={form.education.year_of_grad} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
              <option value="">Select</option>
              {Array.from({length: 2030-2005+1}, (_,i)=>2030-i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5">Scholarship Needed? <span className="text-red-500">*</span></label>
            <select id="education.scholarship" name="education.scholarship" value={form.education.scholarship ? 'yes' : 'no'} onChange={e => handleChange({ target: { name: 'education.scholarship', value: e.target.value === 'yes', type: 'checkbox', checked: e.target.value === 'yes' } })} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </>
      )}
      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">Back</Button>
        <Button type="button" onClick={handleContinue} className="flex-1">Continue</Button>
      </div>
    </>
  );
} 