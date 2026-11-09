import test from "node:test";
import assert from "node:assert/strict";
import { requireAuthenticatedUser, requireOwner, requireAdmin } from "../src/server/auth/guards.ts";

function createMockRequest(role, userId) {
  const headers = new Map();
  if (role && userId) {
    headers.set("x-mock-role", role);
    headers.set("x-mock-user-id", userId);
  }
  return {
    headers: {
      get(name) {
        return headers.get(name) || null;
      },
    },
  };
}

test("auth guards reject unauthenticated requests with 401", async () => {
  const req = createMockRequest(null, null);
  const result = await requireAuthenticatedUser(req);
  assert.equal("response" in result, true);
  assert.equal(result.response.status, 401);
});

test("auth guards accept authenticated customer", async () => {
  const req = createMockRequest("CUSTOMER", "c1234567-0000-0000-0000-000000000001");
  const result = await requireAuthenticatedUser(req);
  assert.equal("user" in result, true);
  assert.equal(result.user.role, "CUSTOMER");
  assert.equal(result.user.id, "c1234567-0000-0000-0000-000000000001");
});

test("owner guard rejects customer with 403", async () => {
  const req = createMockRequest("CUSTOMER", "c1234567-0000-0000-0000-000000000001");
  const result = await requireOwner(req);
  assert.equal("response" in result, true);
  assert.equal(result.response.status, 403);
});

test("owner guard accepts OWNER role", async () => {
  const req = createMockRequest("OWNER", "o1234567-0000-0000-0000-000000000002");
  const result = await requireOwner(req);
  assert.equal("user" in result, true);
  assert.equal(result.user.role, "OWNER");
});

test("owner guard accepts ADMIN role", async () => {
  const req = createMockRequest("ADMIN", "a1234567-0000-0000-0000-000000000003");
  const result = await requireOwner(req);
  assert.equal("user" in result, true);
  assert.equal(result.user.role, "ADMIN");
});

test("admin guard rejects OWNER role with 403", async () => {
  const req = createMockRequest("OWNER", "o1234567-0000-0000-0000-000000000002");
  const result = await requireAdmin(req);
  assert.equal("response" in result, true);
  assert.equal(result.response.status, 403);
});

test("admin guard accepts ADMIN role", async () => {
  const req = createMockRequest("ADMIN", "a1234567-0000-0000-0000-000000000003");
  const result = await requireAdmin(req);
  assert.equal("user" in result, true);
  assert.equal(result.user.role, "ADMIN");
});
