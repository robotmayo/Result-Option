import test from "ava";
import { Some, None, Ok, Err } from "./";

test("Some", t => {
  const regValue = "My Value";
  const reg = new Some(regValue);
  t.true(reg.isSome());
  t.false(reg.isNone());
  t.is(reg.unwrap(), regValue);
  t.is(reg.unwrapOr(""), regValue);
  t.is(reg.unwrapOrElse(() => ""), regValue);
  const mappedSome = reg.map(x => x.toUpperCase());
  t.not(mappedSome, reg);
  t.is(mappedSome.unwrap(), regValue.toUpperCase());
  t.is(reg.mapOr(1, x => 1), 1);
  const annedSomeVal = "Anned Some Str";
  const annedSome = new Some(annedSomeVal);
  t.is(reg.and(annedSome), annedSome);
  t.is(reg.andThen(x => annedSome), annedSome);
  t.is(reg.orElse(() => new Some("f")), reg);
});

test("None", t => {
  const myNone = new None();
  t.false(myNone.isNone());
  t.true(myNone.isNone());
  t.throws(() => myNone.unwrap())
});
