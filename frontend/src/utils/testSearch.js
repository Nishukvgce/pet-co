/**
 * Test file to verify smart search functionality
 */

import { analyzeSearchQuery, getSearchSuggestions } from './smartSearch.js';

// Test cases for search functionality
const testCases = [
  'dry food',
  'wet food', 
  'dog food',
  'cat treats',
  'daily meals',
  'dental chew',
  'puppy food',
  'kitten food'
];

export const testSmartSearch = async () => {
  console.log('🧪 Testing Smart Search...');
  
  for (const testQuery of testCases) {
    try {
      const analysis = await analyzeSearchQuery(testQuery);
      const suggestions = getSearchSuggestions(testQuery);
      
      console.log(`\n📝 Test: "${testQuery}"`);
      console.log('   Analysis:', analysis);
      console.log('   Suggestions:', suggestions.length, 'items');
      
      if (analysis.type === 'subcategory') {
        console.log(`   ✅ Route: ${analysis.route}`);
      } else {
        console.log(`   ⚠️  Type: ${analysis.type}, Route: ${analysis.route}`);
      }
    } catch (error) {
      console.error(`   ❌ Error testing "${testQuery}":`, error);
    }
  }
  
  console.log('\n🎯 Test completed');
};

// Export for use in console
if (typeof window !== 'undefined') {
  window.testSmartSearch = testSmartSearch;
}