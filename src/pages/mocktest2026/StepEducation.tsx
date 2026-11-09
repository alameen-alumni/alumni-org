import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear() + 5;
const inputClass =
  "w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

// Keeps only digits, up to 4 characters, so partial years like "2" or "20" can be typed.
const sanitizeYear = (raw) => raw.replace(/\D/g, '').slice(0, 4);

// Keeps digits and one decimal point, up to 6 characters (e.g. "100.00").
const sanitizePercentage = (raw) => {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  const joined = rest.length ? `${whole}.${rest.join('')}` : whole;
  return joined.slice(0, 6);
};

// Returns an error message for a year, or null when it is valid or still being typed.
const yearError = (value) => {
  if (!value) return null;
  if (value.length < 4) return 'Enter a 4-digit year';
  const year = Number(value);
  if (year < MIN_YEAR || year > MAX_YEAR) return `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`;
  return null;
};

// Returns an error message for a percentage, or null when it is valid or empty.
const percentageError = (value) => {
  if (value === '' || value === undefined) return null;
  const num = parseFloat(value);
  if (Number.isNaN(num)) return 'Enter a valid percentage';
  if (num < 0 || num > 100) return 'Percentage must be between 0 and 100';
  return null;
};

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs text-red-600 mt-1">⚠ {message}</p>;
}

function PercentageHint({ value }) {
  if (!value) return null;
  const error = percentageError(value);
  return error ? (
    <FieldError message={error} />
  ) : (
    <p className="text-xs text-green-600 mt-1">✓ Valid</p>
  );
}

export default function StepEducation({ form, handleChange, handleBack, handleContinue }) {
  // Year and percentage handlers accept partial input and only store sanitized text.
  // Out-of-range values are shown as errors and block Continue.
  const handleYearInput = (e) => {
    handleChange({ target: { name: e.target.name, value: sanitizeYear(e.target.value) } });
  };

  // Percentages above 100 are rejected at the keystroke, as requested.
  const handlePercentageInput = (e) => {
    const value = sanitizePercentage(e.target.value);
    const num = parseFloat(value);
    if (value === '' || value === '.' || (!Number.isNaN(num) && num <= 100)) {
      handleChange({ target: { name: e.target.name, value } });
    }
  };

  const yearFields = [
    'secondary_year',
    'higher_secondary_year',
    'graduation_year',
  ];
  const percentageFields = [
    'secondary_percentage',
    'higher_secondary_percentage',
    'graduation_percentage',
  ];

  const hasErrors =
    yearFields.some((f) => yearError(form[f])) ||
    percentageFields.some((f) => percentageError(form[f]));

  const isComplete =
    form.secondary_year &&
    form.secondary_percentage &&
    form.higher_secondary_year &&
    form.higher_secondary_percentage &&
    form.higher_secondary_stream &&
    form.graduation_year &&
    form.graduation_percentage &&
    form.graduation_stream &&
    form.post_graduation &&
    form.bed;

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
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={form.secondary_year}
              onChange={handleYearInput}
              required
              className={inputClass}
              placeholder="e.g., 2020"
            />
            <FieldError message={yearError(form.secondary_year)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="secondary_percentage">
              Percentage <span className="text-red-500">*</span>
            </label>
            <Input
              id="secondary_percentage"
              name="secondary_percentage"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={form.secondary_percentage}
              onChange={handlePercentageInput}
              required
              className={inputClass}
              placeholder="e.g., 85.5"
            />
            <PercentageHint value={form.secondary_percentage} />
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
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={form.higher_secondary_year}
              onChange={handleYearInput}
              required
              className={inputClass}
              placeholder="e.g., 2022"
            />
            <FieldError message={yearError(form.higher_secondary_year)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="higher_secondary_percentage">
              Percentage <span className="text-red-500">*</span>
            </label>
            <Input
              id="higher_secondary_percentage"
              name="higher_secondary_percentage"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={form.higher_secondary_percentage}
              onChange={handlePercentageInput}
              required
              className={inputClass}
              placeholder="e.g., 80.5"
            />
            <PercentageHint value={form.higher_secondary_percentage} />
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
            className={inputClass}
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
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={form.graduation_year}
              onChange={handleYearInput}
              required
              className={inputClass}
              placeholder="e.g., 2025"
            />
            <FieldError message={yearError(form.graduation_year)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="graduation_percentage">
              Percentage <span className="text-red-500">*</span>
            </label>
            <Input
              id="graduation_percentage"
              name="graduation_percentage"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={form.graduation_percentage}
              onChange={handlePercentageInput}
              required
              className={inputClass}
              placeholder="e.g., 75.5"
            />
            <PercentageHint value={form.graduation_percentage} />
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
            className={inputClass}
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
          className={inputClass}
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
          disabled={!isComplete || hasErrors}
        >
          Continue
        </Button>
      </div>
    </>
  );
}
