#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5173';

const routes = [
  '/',
  '/checklists',
  '/create',
  '/templates',
  '/settings',
  '/inventory'
];

console.log('Testing Vue Checklist App Routes...\n');

async function testRoute(route) {
  try {
    const response = await fetch(`${BASE_URL}${route}`);
    const status = response.ok ? '✅' : '❌';
    console.log(`${status} ${route} - Status: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.log(`❌ ${route} - Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  let allPassed = true;
  
  for (const route of routes) {
    const passed = await testRoute(route);
    if (!passed) allPassed = false;
  }
  
  console.log('\n' + (allPassed ? '✅ All routes working!' : '❌ Some routes failed'));
  process.exit(allPassed ? 0 : 1);
}

// Wait a moment for the server to be ready
setTimeout(runTests, 2000);