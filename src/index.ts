import express from 'express';
import { ToolsService, tool, ParameterType } from '@optimizely-opal/opal-tools-sdk';

// Create Express app
const app = express();
app.use(express.json());

// Create Tools Service
const toolsService = new ToolsService(app);

// Interfaces for tool parameters
interface GreetingParameters {
  name: string;
  language?: string;
}

interface DateParameters {
  format?: string;
}

/**
 * Greeting Tool: Greets a person in a random language
 */
// Apply tool decorator after function definition
async function iis(parameters: GreetingParameters) {
  const response = await fetch('http://api.open-notify.org/iss-now.json');
  if (!response.ok) {
    throw new Error('Failed to fetch ISS location');
  }
  const data = await response.json();
  return data;
}

/**
 * Today's Date Tool: Returns today's date in the specified format
 */
// Apply tool decorator after function definition
async function todaysDate2(parameters: DateParameters) {
  const format = parameters.format || '%Y-%m-%d';

  // Get today's date
  const today = new Date();

  // Format the date (simplified implementation)
  let formattedDate: string;
  if (format === '%Y-%m-%d') {
    formattedDate = today.toISOString().split('T')[0];
  } else if (format === '%B %d, %Y') {
    formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else if (format === '%d/%m/%Y') {
    formattedDate = today.toLocaleDateString('en-GB');
  } else {
    // Default to ISO format
    formattedDate = today.toISOString().split('T')[0];
  }

  return {
    date: formattedDate,
    format: format,
    timestamp: today.getTime() / 1000
  };
}

// Register the tools using decorators with explicit parameter definitions
tool({
  name: 'iis',
  description: 'Get the location of the International Space Station (ISS)',
})(iis);

tool({
  name: 'todays-date2',
  description: 'Returns today\'s date in the specified format',
  parameters: [
    {
      name: 'format',
      type: ParameterType.String,
      description: 'Date format (defaults to ISO format)',
      required: false
    }
  ]
})(todaysDate2);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Discovery endpoint: http://localhost:${PORT}/discovery`);
});