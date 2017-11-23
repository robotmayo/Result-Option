import test from "ava";
import * as rustlike from "./";

test("Some", t => {
  const reg = new rustlike.Some("My Value");
  t.true(reg.isSome());
  t.false(reg.isNone());
});
