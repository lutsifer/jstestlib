// @flow
var SHA256Compress = require('./sha256compress')

function prf (a: number, b: number, c: number, d: number, x: Buffer, y: Buffer) {
  var blob = Buffer.alloc(64)

  x.copy(blob, 0)
  y.copy(blob, 32)

  blob[0] &= 0x0F
  blob[0] |= (a ? 1 << 7 : 0) | (b ? 1 << 6 : 0) | (c ? 1 << 5 : 0) | (d ? 1 << 4 : 0)

  var hasher = new SHA256Compress()
  hasher.update(blob)
  return hasher.hash()
}

function prfAddr (aSk: Buffer, t: number) {
  var y = Buffer.alloc(32)
  y.fill(0)
  y[0] = t

  return prf(1, 1, 0, 0, aSk, y)
}

function prfAddrAPk (aSk: Buffer) {
  return prfAddr(aSk, 0)
}

function prfAddrSkEnc (aSk: Buffer) {
  return prfAddr(aSk, 1)
}

function prfNf (aSk: Buffer, rho: Buffer) {
  return prf(1, 1, 1, 0, aSk, rho)
}

function prfPk (aSk: Buffer, i0: number, hSig: Buffer) {
  if ((i0 !== 0) && (i0 !== 1)) {
    throw new Error('PRF_pk invoked with index out of bounds')
  }

  return prf(0, i0, 0, 0, aSk, hSig)
}

function prfRho (phi: Buffer, i0: number, hSig: Buffer) {
  if ((i0 !== 0) && (i0 !== 1)) {
    throw new Error('PRF_rho invoked with index out of bounds')
  }

  return prf(0, i0, 1, 0, phi, hSig)
}

module.exports = {
  PRF_addr_a_pk: prfAddrAPk,
  PRF_addr_sk_enc: prfAddrSkEnc,
  PRF_nf: prfNf,
  PRF_pk: prfPk,
  PRF_rho: prfRho
}
