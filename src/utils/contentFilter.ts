import { EnvironmentType } from '../context/environmentContext';

/**
 * Filters content based on the audience field and selected environments
 * @param content - Array of content items with an audience field
 * @param selectedEnvironments - Array of selected environment types
 * @returns Filtered array of content items
 */
export function filterContentByEnvironment<T extends { audience?: string }>(
  content: T[] | undefined,
  selectedEnvironments: EnvironmentType[]
): T[] {
  if (!content || !Array.isArray(content)) {
    return [];
  }

  // If no environments are selected, return empty array (shouldn't happen, but safety check)
  if (selectedEnvironments.length === 0) {
    return [];
  }

  return content.filter((item) => {
    const audience = item.audience?.toLowerCase().trim();
    
    // If no audience is set, include it (backward compatibility)
    if (!audience) {
      return true;
    }

    // Check if the audience matches any of the selected environments
    return selectedEnvironments.some((env) => {
      const envLower = env.toLowerCase();
      // Handle exact matches and partial matches (e.g., "members" matches "members")
      return audience === envLower || audience.includes(envLower);
    });
  });
}

/**
 * Checks if a single content item should be visible based on selected environments
 * @param audience - The audience string from the content item
 * @param selectedEnvironments - Array of selected environment types
 * @returns Boolean indicating if the content should be visible
 */
export function isContentVisible(
  audience: string | undefined,
  selectedEnvironments: EnvironmentType[]
): boolean {
  if (!audience) {
    return true; // Show content without audience (backward compatibility)
  }

  if (selectedEnvironments.length === 0) {
    return false;
  }

  const audienceLower = audience.toLowerCase().trim();
  
  return selectedEnvironments.some((env) => {
    const envLower = env.toLowerCase();
    return audienceLower === envLower || audienceLower.includes(envLower);
  });
}

