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
async function iss(parameters: GreetingParameters) {
  const response = await fetch('http://api.open-notify.org/iss-now.json');
  if (!response.ok) {
    throw new Error('Failed to fetch ISS location');
  }
  const data = await response.json();
  return data;
}

// Register the tools using decorators with explicit parameter definitions
tool({
  name: 'iss',
  description: 'Get the location of the International Space Station (ISS)',
})(iss);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Discovery endpoint: http://localhost:${PORT}/discovery`);
});