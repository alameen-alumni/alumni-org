import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function StepEducation({ form, handleChange, handleBack, handleContinue }) {
  
  // Handle percentage input with validation
  const handlePercentageChange = (e) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    
    // Allow empty or valid numbers up to 100
    if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 100)) {
      handleChange(e);
    }
  };

  // Handle year input
  const handleYearChange = (e) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    const currentYear = new Date().getFullYear();
    
    // Allow empty or valid years
    if (value === '' || (!isNaN(numValue) && numValue >= 1950 && numValue <= currentYear + 5)) {
      handleChange(e);
    }
  };

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-teal-700 mb-2">Education Details</h3>
      </div>

      {/* Secondary Examination */}
      <div className="mb-4">
        <h4 className="text-md font-medium text-teal-600 mb-3">Secondary Examination (Class 10)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="secondary_year">
              Year <span className="text-red-500">*</span>
            </label>
            <Input
              id="secondary_year"
              name="secondary_year"
              type="number"
              value={form.secondary_year}
              onChange={handleYearChange}
              required
              min="1950"
              max={new Date().getFullYear() + 5}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., 2020"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="secondary_percentage">
              Percentage <span className="text-red-500">*</span>
            </label>
            <Input
              id="secondary_percentage"
              name="secondary_percentage"
              type="number"
              step="0.01"
              value={form.secondary_percentage}
              onChange={handlePercentageChange}
              required
              min="0"
              max="100"
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., 85.5"
            />
            {form.secondary_percentage && (
              <p className="text-xs text-gray-500 mt-1">
                {parseFloat(form.secondary_percentage) > 100 ? (
                  <span className="text-red-600">⚠ Percentage cannot exceed 100</span>
                ) : (
                  <span className="text-green-600">✓ Valid</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Higher Secondary Examination */}
      <div className="mb-4">
        <h4 className="text-md font-medium text-teal-600 mb-3">Higher Secondary Examination (Class 12)</h4>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="higher_secondary_year">
              Year <span className="text-red-500">*</span>
            </label>
            <Input
              id="higher_secondary_year"
              name="higher_secondary_year"
              type="number"
              value={form.higher_secondary_year}
              onChange={handleYearChange}
              required
              min="1950"
              max={new Date().getFullYear() + 5}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., 2022"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="higher_secondary_percentage">
              Percentage <span className="text-red-500">*</span>
            </label>
            <Input
              id="higher_secondary_percentage"
              name="higher_secondary_percentage"
              type="number"
              step="0.01"
              value={form.higher_secondary_percentage}
              onChange={handlePercentageChange}
              required
              min="0"
              max="100"
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., 80.5"
            />
            {form.higher_secondary_percentage && (
              <p className="text-xs text-gray-500 mt-1">
                {parseFloat(form.higher_secondary_percentage) > 100 ? (
                  <span className="text-red-600">⚠ Percentage cannot exceed 100</span>
                ) : (
                  <span className="text-green-600">✓ Valid</span>
                )}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="higher_secondary_stream">
            Stream <span className="text-red-500">*</span>
          </label>
          <select
            id="higher_secondary_stream"
            name="higher_secondary_stream"
            value={form.higher_secondary_stream}
            onChange={handleChange}
            required
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select Stream</option>
            <option value="science">Science</option>
            <option value="commerce">Commerce</option>
            <option value="arts">Arts</option>
          </select>
        </div>
      </div>

      {/* Graduation */}
      <div className="mb-4">
        <h4 className="text-md font-medium text-teal-600 mb-3">Graduation</h4>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="graduation_year">
              Year <span className="text-red-500">*</span>
            </label>
            <Input
              id="graduation_year"
              name="graduation_year"
              type="number"
              value={form.graduation_year}
              onChange={handleYearChange}
              required
              min="1950"
              max={new Date().getFullYear() + 5}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., 2025 or ongoing"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="graduation_percentage">
              Percentage <span className="text-red-500">*</span>
            </label>
            <Input
              id="graduation_percentage"
              name="graduation_percentage"
              type="number"
              step="0.01"
              value={form.graduation_percentage}
              onChange={handlePercentageChange}
              required
              min="0"
              max="100"
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., 75.5 or expected"
            />
            {form.graduation_percentage && (
              <p className="text-xs text-gray-500 mt-1">
                {parseFloat(form.graduation_percentage) > 100 ? (
                  <span className="text-red-600">⚠ Percentage cannot exceed 100</span>
                ) : (
                  <span className="text-green-600">✓ Valid</span>
                )}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="graduation_stream">
            Stream/Degree <span className="text-red-500">*</span>
          </label>
          <Input
            id="graduation_stream"
            name="graduation_stream"
            value={form.graduation_stream}
            onChange={handleChange}
            required
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., B.Sc, B.A, B.Com, B.Tech"
          />
        </div>
      </div>

      {/* Post Graduation */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5">
          Post Graduation <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="post_graduation"
              value="yes"
              checked={form.post_graduation === 'yes'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="post_graduation"
              value="no"
              checked={form.post_graduation === 'no'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">No</span>
          </label>
        </div>
      </div>

      {/* B.Ed */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5">
          B.Ed <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="bed"
              value="yes"
              checked={form.bed === 'yes'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="bed"
              value="no"
              checked={form.bed === 'no'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">No</span>
          </label>
        </div>
      </div>

      {/* Which exam qualified */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="qualified_exams">
          Which Exams Have You Qualified? (e.g., NET, SET, GATE, etc.)
        </label>
        <Input
          id="qualified_exams"
          name="qualified_exams"
          value={form.qualified_exams}
          onChange={handleChange}
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter qualified exams (optional)"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">
          Back
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          className="flex-1"
          disabled={
            !form.secondary_year ||
            !form.secondary_percentage ||
            parseFloat(form.secondary_percentage) > 100 ||
            !form.higher_secondary_year ||
            !form.higher_secondary_percentage ||
            parseFloat(form.higher_secondary_percentage) > 100 ||
            !form.higher_secondary_stream ||
            !form.graduation_year ||
            !form.graduation_percentage ||
            parseFloat(form.graduation_percentage) > 100 ||
            !form.graduation_stream ||
            !form.post_graduation ||
            !form.bed
          }
        >
          Continue
        </Button>
      </div>
    </>
  );
}
