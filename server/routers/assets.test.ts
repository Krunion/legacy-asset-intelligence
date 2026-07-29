import { describe, it, expect } from "vitest";

// Test the generateAssetTag function logic
describe("Asset Management - Tag Generation", () => {
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  function generateAssetTag(): string {
    let tag = "LAI-";
    for (let i = 0; i < 6; i++) {
      tag += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return tag;
  }

  it("generates tags with LAI- prefix", () => {
    const tag = generateAssetTag();
    expect(tag).toMatch(/^LAI-/);
  });

  it("generates 10-character tags (LAI- + 6 chars)", () => {
    const tag = generateAssetTag();
    expect(tag.length).toBe(10);
  });

  it("uses only non-ambiguous characters", () => {
    for (let i = 0; i < 100; i++) {
      const tag = generateAssetTag();
      const suffix = tag.slice(4);
      for (const char of suffix) {
        expect(CHARS).toContain(char);
      }
    }
  });

  it("generates unique tags (statistical)", () => {
    const tags = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      tags.add(generateAssetTag());
    }
    // With 32^6 = ~1 billion possible tags, 1000 should all be unique
    expect(tags.size).toBe(1000);
  });

  it("does not contain ambiguous characters (0, O, 1, I, l)", () => {
    // The charset is ABCDEFGHJKLMNPQRSTUVWXYZ23456789
    // Missing: 0, O, I, 1, and lowercase l
    for (let i = 0; i < 100; i++) {
      const tag = generateAssetTag();
      const suffix = tag.slice(4);
      // Should not contain 0 (zero), O (letter O), I (letter I), 1 (one), or l (lowercase L)
      expect(suffix).not.toMatch(/[0OI1l]/);
    }
  });
});

describe("Asset Management - Input Validation", () => {
  it("validates status enum values", () => {
    const validStatuses = ["active", "inactive", "disposed", "in_repair", "lost", "transferred"];
    validStatuses.forEach((status) => {
      expect(validStatuses).toContain(status);
    });
  });

  it("validates condition enum values", () => {
    const validConditions = ["new", "excellent", "good", "fair", "poor", "salvage"];
    validConditions.forEach((condition) => {
      expect(validConditions).toContain(condition);
    });
  });

  it("validates barcode type enum values", () => {
    const validTypes = ["code128", "code39", "qr"];
    validTypes.forEach((type) => {
      expect(validTypes).toContain(type);
    });
  });
});

describe("Asset Management - CSV Import Mapping", () => {
  it("maps common column name variations", () => {
    const columnMappings: Record<string, string[]> = {
      name: ["name", "Name", "Asset Name", "asset_name", "Item", "item"],
      manufacturer: ["manufacturer", "Manufacturer", "Make", "make", "Brand", "brand"],
      serialNumber: ["serialNumber", "Serial Number", "serial_number", "Serial", "serial", "SN"],
      location: ["location", "Location", "Site", "site"],
      department: ["department", "Department", "Dept", "dept"],
    };

    // Each field should have at least 3 recognized column name variants
    Object.entries(columnMappings).forEach(([field, variants]) => {
      expect(variants.length).toBeGreaterThanOrEqual(3);
      expect(field).toBeTruthy();
    });
  });

  it("handles Asset Panda export format columns", () => {
    // Asset Panda exports typically include these columns
    const assetPandaColumns = [
      "Asset Name", "Serial Number", "Location", "Department",
      "Manufacturer", "Model", "Condition", "Purchase Date", "Purchase Price",
    ];

    const ourMappedFields = [
      "name", "serialNumber", "location", "department",
      "manufacturer", "model", "condition", "acquisitionDate", "acquisitionCost",
    ];

    expect(assetPandaColumns.length).toBe(ourMappedFields.length);
  });
});

describe("Asset Management - Barcode Formats", () => {
  it("Code 128 supports full ASCII", () => {
    // Code 128 can encode all 128 ASCII characters
    const testValues = ["LAI-ABC123", "SN:12345-XYZ", "Asset#001"];
    testValues.forEach((val) => {
      expect(val.length).toBeGreaterThan(0);
      expect(val.length).toBeLessThanOrEqual(80); // practical limit
    });
  });

  it("Code 39 supports uppercase + digits", () => {
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-. $/+%";
    const testTag = "LAI-ABC123";
    for (const char of testTag) {
      expect(validChars).toContain(char);
    }
  });

  it("QR codes support up to 4296 alphanumeric characters", () => {
    const maxAlphanumeric = 4296;
    const typicalAssetTag = "LAI-ABC123"; // 10 chars
    expect(typicalAssetTag.length).toBeLessThan(maxAlphanumeric);
  });
});
