// example.js — an unsupported file type for agent creation (code, not a doc).
// Used by TC12 to verify Cimba warns before treating code as agent instructions.

function greet(name) {
  return `Hello, ${name}!`;
}

class Agent {
  constructor(name, instructions) {
    this.name = name;
    this.instructions = instructions;
  }

  describe() {
    return `${this.name}: ${this.instructions}`;
  }
}

module.exports = { greet, Agent };
