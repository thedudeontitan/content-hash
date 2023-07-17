import { describe, expect, it } from "vitest";

import { cidForWeb, cidV0ToV1Base32 } from "./helpers";

const ipfs_CIDv0 = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";
const ipfsBase32DagPb =
  "bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4";
const ipfsBase32Libp2pKey =
  "bafzbeie5745rpv2m6tjyuugywy4d5ewrqgqqhfnf445he3omzpjbx5xqxe";

describe("cidV0ToV1Base32", () => {
  it("should convert CID v0 into v1", () => {
    expect(cidV0ToV1Base32(ipfs_CIDv0)).toBe(ipfsBase32DagPb);
  });
  it("should keep CID v1 Base32 as-is", () => {
    expect(cidV0ToV1Base32(ipfsBase32DagPb)).toBe(ipfsBase32DagPb);
    expect(cidV0ToV1Base32(ipfsBase32Libp2pKey)).toBe(ipfsBase32Libp2pKey);
  });
});

describe("cidForWeb", () => {
  it("should convert CIDv0 into case-insenitive base", () => {
    expect(cidForWeb(ipfs_CIDv0)).toBe(ipfsBase32DagPb);
  });
  it("should keep CIDv1 Base32 if under DNS limit", () => {
    const b32_59chars =
      "bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4";
    expect(cidForWeb(b32_59chars)).toBe(b32_59chars);
  });
  it("should convert to Base36 if it helps with DNS limit", () => {
    const b32_65chars =
      "bafzaajaiaejca4syrpdu6gdx4wsdnokxkprgzxf4wrstuc34gxw5k5jrag2so5gk";
    const b36_62chars =
      "k51qzi5uqu5dj16qyiq0tajolkojyl9qdkr254920wxv7ghtuwcz593tp69z9m";
    expect(cidForWeb(b32_65chars)).toBe(b36_62chars);
  });
  it("should throw if CID is over DNS limit", () => {
    const b32_sha512_110chars =
      "bafkrgqhhyivzstcz3hhswshfjgy6ertgmnqeleynhwt4dlfsthi4hn7zgh4uvlsb5xncykzapi3ocd4lzogukir6ksdy6wzrnz6ohnv4aglcs";
    expect(() => cidForWeb(b32_sha512_110chars)).toThrow(
      "CID is longer than DNS limit of 63 characters and is not compatible with public gateways"
    );
  });
});
