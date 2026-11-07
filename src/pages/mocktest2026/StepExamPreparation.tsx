import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function StepExamPreparation({ form, handleChange, handleBack, loading }) {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-teal-700 mb-2">Exam Preparation</h3>
      </div>

      {/* Which exam are you preparing for */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="preparing_for">
          Which Exam Are You Preparing For? <span className="text-red-500">*</span>
        </label>
        <Input
          id="preparing_for"
          name="preparing_for"
          value={form.preparing_for}
          onChange={handleChange}
          required
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g., UPSC, WBCS, SSC, Banking, Teaching, etc."
        />
        <p className="text-xs text-gray-500 mt-1">You can enter multiple exams separated by commas</p>
      </div>

      {/* Summary Box */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-teal-800 mb-2">Registration Summary</h4>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Name:</span> {form.name}</p>
          <p><span className="font-medium">Father's Name:</span> {form.father_name}</p>
          <p><span className="font-medium">Mobile:</span> {form.mobile}</p>
          <p><span className="font-medium">Email:</span> {form.email}</p>
          <p><span className="font-medium">Alumni:</span> {form.is_alumni === 'yes' ? `Yes (Reg ID: ${form.reg_id})` : 'No'}</p>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> After submitting, you will receive a registration number. 
          Please take a screenshot of your registration details for future reference.
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline" disabled={loading}>
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!form.preparing_for || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Registration'
          )}
        </Button>
      </div>
    </>
  );
}
