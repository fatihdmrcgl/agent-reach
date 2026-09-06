export class AgentReachError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
  }
}

export class MissingCredentialError extends AgentReachError {}

export class UnsupportedCapabilityError extends AgentReachError {}

export class ProviderRequestError extends AgentReachError {}
