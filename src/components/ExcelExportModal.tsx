import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Edit2,
} from "lucide-react";
import { type ExcelExportModalProps, type ExportOptions } from '../types';

const ExcelExportModal = ({
  open,
  onOpenChange,
  data,
  title = "Export Data",
  onExport,
}) => {
  const [selectedFields, setSelectedFields] = useState<any>({});
  const [filename, setFilename] = useState("");
  const [isEditingFilename, setIsEditingFilename] = useState(false);

  // Auto-detect fields from data
  useEffect(() => {
    if (data.length > 0) {
      const sampleItem = data[0];
      const fields: any = {};

      // Recursively extract all fields
      const extractFields = (obj: any, prefix = "") => {
        for (const [key, value] of Object.entries(obj)) {
          const fieldKey = prefix ? `${prefix}.${key}` : key;

          if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
          ) {
            extractFields(value, fieldKey);
          } else {
            // Use pre-checked fields configuration
            fields[fieldKey] = preCheckedFields[fieldKey] || false;
          }
        }
      };

      extractFields(sampleItem);
      setSelectedFields(fields);

      // Set default filename
      const defaultFilename = `${title.toLowerCase().replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }`;
      setFilename(defaultFilename);
    }
  }, [data, title]);

  const getFieldOptions = () => {
    if (data.length === 0) return [];

    const sampleItem = data[0];
    const options: Array<{ key: string; label: string; type: string }> = [];

    const extractFields = (obj: any, prefix = "") => {
      for (const [key, value] of Object.entries(obj)) {
        const fieldKey = prefix ? `${prefix}.${key}` : key;

        if (
          value !== null &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          extractFields(value, fieldKey);
        } else {
          // Only include fields that are configured to be shown
          if (fieldConfig[fieldKey] !== false) {
            const type = Array.isArray(value) ? "array" : typeof value;
            const label = getFieldLabel(fieldKey);
            options.push({
              key: fieldKey,
              label: label,
              type,
            });
          }
        }
      }
    };

    extractFields(sampleItem);

    // Sort options based on field order
    options.sort((a, b) => {
      const indexA = fieldOrder.indexOf(a.key);
      const indexB = fieldOrder.indexOf(b.key);

      // If both fields are in the order list, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one is in the order list, prioritize it
      if (indexA !== -1 && indexB === -1) {
        return -1;
      }
      if (indexA === -1 && indexB !== -1) {
        return 1;
      }

      // If neither is in the order list, keep original order
      return 0;
    });

    return options;
  };

  // Field configuration - Controls which fields are available for selection
  const fieldConfig: { [key: string]: boolean } = {
    // Basic Information
    name: true,
    reg_id: true,
    role: false,
    uid: false, // Exclude - UID
    id: false, // Exclude - document ID
    createdAt: false, // Exclude - internal field
    updatedAt: false, // Exclude - internal field
    password: false, // Exclude - sensitive data
    "info.photo": false, // Exclude - not needed for export

    // Contact Information
    "info.contact.email": true,
    "info.contact.mobile": true,
    "info.contact.mobile_wp": true,
    "info.contact.whatsapp": true,
    "info.contact.whatsapp_wp": true,

    // Address Information
    "info.address.present": true,
    "info.address.permanent": true,

    // Parent Information
    "info.parent.father": true,
    "info.parent.mother": false,

    // Blood Information
    "info.blood.group": true,
    "info.blood.isDonating": true,

    // Profession Information
    "profession.working": true,
    "profession.company": true,
    "profession.position": true,

    // Education Information
    "education.admit_class": true,
    "education.admit_year": true,
    "education.last_class": true,
    "education.passout_year": true,
    "education.curr_degree": true,
    "education.curr_college": true,
    "education.current_class": true,
    "education.year_of_grad": true,
    "education.scholarship": true,
    "education.study": true,
    "event.present": true,
    "event.paid": true,
    "event.payment_approved": true,
    "event.pay_id": true,
    "event.reg_fee": true,
    "event.donate": true,
    "event.accompany": true,
    "event.accompany_rel": true,

    // Event Perks
    "event.perks.to_pay": true,
    "event.perks.jacket": true,
    "event.perks.welcome_gift": true,
    "event.perks.special_gift_hamper": true,
  };

  // Field order - Determines the order of fields in modal and export
  const fieldOrder: string[] = [
    "name",
    "reg_id",
    "info.contact.email",
    "info.contact.mobile",
    "info.contact.whatsapp",
    "info.contact.mobile_wp",
    "info.contact.whatsapp_wp",
    "info.address.present",
    "info.address.permanent",
    "info.parent.father",
    "info.parent.mother",
    "info.blood.group",
    "info.blood.isDonating",
    "profession.working",
    "profession.company",
    "profession.position",
    "education.admit_class",
    "education.admit_year",
    "education.last_class",
    "education.passout_year",
    "education.curr_degree",
    "education.curr_college",
    "education.current_class",
    "education.year_of_grad",
    "education.scholarship",
    "education.study",
    "event.present",
    "event.accompany",
    "event.accompany_rel",
    "event.reg_fee",
    "event.donate",
    "event.perks.to_pay",
    "event.perks.jacket",
    "event.perks.welcome_gift",
    "event.perks.special_gift_hamper",
    "event.paid",
    "event.payment_approved",
    "event.pay_id",
  ];

  // Pre-checked fields - Fields that are selected by default
  const preCheckedFields: { [key: string]: boolean } = {
    name: true,
    reg_id: true,
    "info.contact.email": true,
    "info.contact.mobile": true,
    "profession.working": true,
    "event.paid": true,
    "event.pay_id": true,
    "event.payment_approved": true,
    // "education.admit_year": true,  	
    "education.last_class": true,  	
    "education.passout_year": true,
    "info.blood.group": true,
    // "info.blood.isDonating": true,
    "event.present": true,
    "event.accompany": true,
    "event.accompany_rel": true,
    "event.donate": true,
    "event.reg_fee": true,
    "event.perks.to_pay": true,
    "event.perks.jacket": true,
    "event.perks.welcome_gift": true,
    "event.perks.special_gift_hamper": true,
    "info.address.present": true,
    // "info.address.permanent": true,
    "info.parent.father": true,
    "profession.company": true,
    "profession.position": true,
    "education.curr_degree": true,
    // "education.curr_college": true,
    // "education.current_class": true,
    // "education.year_of_grad": true,
    // "education.scholarship": true,
    "education.study": true,
  };

  const getFieldLabel = (fieldKey: string) => {
    const labels: { [key: string]: string } = {
      name: "Name",
      reg_id: "Registration ID",
      createdAt: "Created At",
      updatedAt: "Updated At",
      password: "Password",
      "info.photo": "Photo",

      // Contact Information
      "info.contact.email": "Email",
      "info.contact.mobile": "Primary Mobile",
      "info.contact.mobile_wp": "Primary  WhatsApp",
      "info.contact.whatsapp": "Secondary Mobile",
      "info.contact.whatsapp_wp": "SecondaryWhatsApp",

      // Address Information
      "info.address.present": "Present Address",
      "info.address.permanent": "Permanent Address",

      // Parent Information
      "info.parent.father": "Father Name",
      "info.parent.mother": "Mother Name",

      // Blood Information
      "info.blood.group": "Blood Group",
      "info.blood.isDonating": "Blood Donate",

      // Profession Information
      "profession.working": "Currently Working",
      "profession.company": "Company",
      "profession.position": "Position",

      // Event Information
      "event.present": "Will Attend",
      "event.accompany": "Accompanying Persons",
      "event.accompany_rel": "Accompanying Relationship",
      "event.paid": "Payment Completed",
      "event.pay_id": "Payment ID",
      "event.payment_approved": "Payment Approved",
      "event.reg_fee": "Registration Fee",

      // Event Perks
      "event.perks.to_pay": "Amount to Pay",
      "event.perks.jacket": "Jacket",
      "event.perks.welcome_gift": "Welcome Gift",
      "event.perks.special_gift_hamper": "Special Gift Hamper",

      // Education Information
      "education.admit_class": "Admit Class",
      "education.admit_year": "Admit Year",
      "education.last_class": "Passout Class",
      "education.passout_year": "Passout Year",
      "education.curr_degree": "Current Degree",
      "education.curr_college": "College",
      "education.current_class": "Current Class",
      "education.year_of_grad": "Year of Graduation",
      "education.scholarship": "Scholarship",
      "education.study": "Currently Studying",

      // Donation
      "event.donate": "Donation Amount",
    };

    return labels[fieldKey] || fieldKey.split(".").pop() || fieldKey;
  };

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleSelectAll = () => {
    const fieldOptions = getFieldOptions();
    const allSelected = fieldOptions.reduce((acc, field) => {
      acc[field.key] = true;
      return acc;
    }, {} as any);
    setSelectedFields(allSelected);
  };

  const handleSelectNone = () => {
    const fieldOptions = getFieldOptions();
    const noneSelected = fieldOptions.reduce((acc, field) => {
      acc[field.key] = false;
      return acc;
    }, {} as any);
    setSelectedFields(noneSelected);
  };

  const selectedCount = Object.values(selectedFields).filter(Boolean).length;
  const fieldOptions = getFieldOptions();

  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined) return "";

    switch (type) {
      case "boolean":
        return value ? "Yes" : "No";
      case "number":
        return value.toString();
      case "date":
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        return value;
      default:
        return value.toString();
    }
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  const generateCSV = (options: ExportOptions) => {
    const selectedFields = Object.keys(options.selectedFields).filter(
      (key) => options.selectedFields[key]
    );

    if (selectedFields.length === 0) return "";

    // Order fields based on predefined field order
    const orderedFields = selectedFields.sort((a, b) => {
      const indexA = fieldOrder.indexOf(a);
      const indexB = fieldOrder.indexOf(b);

      // If both fields are in the order list, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one is in the order list, prioritize it
      if (indexA !== -1 && indexB === -1) {
        return -1;
      }
      if (indexA === -1 && indexB !== -1) {
        return 1;
      }

      // If neither is in the order list, keep original order
      return 0;
    });

    const headers = orderedFields.map((field) => {
      const option = fieldOptions.find((f) => f.key === field);
      return option ? option.label : field;
    });

    const rows = data.map((item) => {
      return orderedFields
        .map((field) => {
          const value = getNestedValue(item, field);
          const option = fieldOptions.find((f) => f.key === field);
          const formattedValue = formatValue(value, option?.type || "string");
          return `"${formattedValue}"`;
        })
        .join(",");
    });

    const csvContent = [headers.join(","), ...rows].filter(Boolean).join("\n");

    return csvContent;
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportClick = () => {
    const csvContent = generateCSV({
      selectedFields,
      filename,
    });

    if (csvContent) {
      downloadCSV(csvContent, filename);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="w-4 h-4" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Export Settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Filename</Label>
              {isEditingFilename ? (
                <Input
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  onBlur={() => setIsEditingFilename(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingFilename(false);
                    }
                  }}
                  placeholder="export_filename"
                  className="mt-1 flex-grow"
                  autoFocus
                />
              ) : (
                <div
                  className="flex items-center gap-2 mt-1 p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 flex-grow"
                  onClick={() => setIsEditingFilename(true)}
                >
                  <span className="flex-1 text-sm text-gray-700">
                    {filename || "export_filename"}
                  </span>
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs px-2 py-1 h-7"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectNone}
              className="text-xs px-2 py-1 h-7"
            >
              Select None
            </Button>
          </div>

          {/* Field Selection */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">
              Select Fields to Export:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 max-h-96 overflow-y-auto">
              {fieldOptions.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleFieldToggle(field.key)}
                >
                  <div className="flex-shrink-0">
                    {selectedFields[field.key] ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900">
                      {field.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          
            {selectedCount === 0 && (
              <p className="text-red-600 font-medium">
                ⚠️ Please select at least one field to export
              </p>
            )}
         
        </div>

        <DialogFooter className="h-6">
          {/* Summary */}
          <div className="bg-blue-50 p-1.5 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>{data.length}</strong> records will be exported with{" "}
              <strong>{selectedCount}</strong> fields selected.
            </p>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExportClick}
            disabled={selectedCount === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export ({selectedCount} fields)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelExportModal;
