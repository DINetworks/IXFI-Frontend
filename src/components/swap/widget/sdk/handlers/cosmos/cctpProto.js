'use strict'
import _m0 from 'protobufjs/minimal.js'
import Long from 'long'

export const protobufPackage = 'circle.cctp.v1'

function createBaseMsgUpdateOwner() {
  return { from: '', newOwner: '' }
}

export const MsgUpdateOwner = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.newOwner !== '') {
      writer.uint32(18).string(message.newOwner)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateOwner()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.newOwner = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      newOwner: isSet(object.newOwner) ? String(object.newOwner) : ''
    }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.newOwner !== '') {
      obj.newOwner = message.newOwner
    }
    return obj
  },

  create(base) {
    return MsgUpdateOwner.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgUpdateOwner()
    message.from = object.from ?? ''
    message.newOwner = object.newOwner ?? ''
    return message
  }
}

function createBaseMsgUpdateOwnerResponse() {
  return {}
}

export const MsgUpdateOwnerResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateOwnerResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgUpdateOwnerResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgUpdateOwnerResponse()
    return message
  }
}

function createBaseMsgUpdateAttesterManager() {
  return { from: '', newAttesterManager: '' }
}

export const MsgUpdateAttesterManager = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.newAttesterManager !== '') {
      writer.uint32(18).string(message.newAttesterManager)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateAttesterManager()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.newAttesterManager = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      newAttesterManager: isSet(object.newAttesterManager) ? String(object.newAttesterManager) : ''
    }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.newAttesterManager !== '') {
      obj.newAttesterManager = message.newAttesterManager
    }
    return obj
  },

  create(base) {
    return MsgUpdateAttesterManager.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgUpdateAttesterManager()
    message.from = object.from ?? ''
    message.newAttesterManager = object.newAttesterManager ?? ''
    return message
  }
}

function createBaseMsgUpdateAttesterManagerResponse() {
  return {}
}

export const MsgUpdateAttesterManagerResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateAttesterManagerResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgUpdateAttesterManagerResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgUpdateAttesterManagerResponse()
    return message
  }
}

function createBaseMsgUpdateTokenController() {
  return { from: '', newTokenController: '' }
}

export const MsgUpdateTokenController = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.newTokenController !== '') {
      writer.uint32(18).string(message.newTokenController)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateTokenController()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.newTokenController = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      newTokenController: isSet(object.newTokenController) ? String(object.newTokenController) : ''
    }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.newTokenController !== '') {
      obj.newTokenController = message.newTokenController
    }
    return obj
  },

  create(base) {
    return MsgUpdateTokenController.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgUpdateTokenController()
    message.from = object.from ?? ''
    message.newTokenController = object.newTokenController ?? ''
    return message
  }
}

function createBaseMsgUpdateTokenControllerResponse() {
  return {}
}

export const MsgUpdateTokenControllerResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateTokenControllerResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgUpdateTokenControllerResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgUpdateTokenControllerResponse()
    return message
  }
}

function createBaseMsgUpdatePauser() {
  return { from: '', newPauser: '' }
}

export const MsgUpdatePauser = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.newPauser !== '') {
      writer.uint32(18).string(message.newPauser)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdatePauser()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.newPauser = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      newPauser: isSet(object.newPauser) ? String(object.newPauser) : ''
    }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.newPauser !== '') {
      obj.newPauser = message.newPauser
    }
    return obj
  },

  create(base) {
    return MsgUpdatePauser.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgUpdatePauser()
    message.from = object.from ?? ''
    message.newPauser = object.newPauser ?? ''
    return message
  }
}

function createBaseMsgUpdatePauserResponse() {
  return {}
}

export const MsgUpdatePauserResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdatePauserResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgUpdatePauserResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgUpdatePauserResponse()
    return message
  }
}

function createBaseMsgAcceptOwner() {
  return { from: '' }
}

export const MsgAcceptOwner = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgAcceptOwner()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return { from: isSet(object.from) ? String(object.from) : '' }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    return obj
  },

  create(base) {
    return MsgAcceptOwner.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgAcceptOwner()
    message.from = object.from ?? ''
    return message
  }
}

function createBaseMsgAcceptOwnerResponse() {
  return {}
}

export const MsgAcceptOwnerResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgAcceptOwnerResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgAcceptOwnerResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgAcceptOwnerResponse()
    return message
  }
}

function createBaseMsgEnableAttester() {
  return { from: '', attester: '' }
}

export const MsgEnableAttester = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.attester !== '') {
      writer.uint32(18).string(message.attester)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgEnableAttester()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.attester = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      attester: isSet(object.attester) ? String(object.attester) : ''
    }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.attester !== '') {
      obj.attester = message.attester
    }
    return obj
  },

  create(base) {
    return MsgEnableAttester.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgEnableAttester()
    message.from = object.from ?? ''
    message.attester = object.attester ?? ''
    return message
  }
}

function createBaseMsgEnableAttesterResponse() {
  return {}
}

export const MsgEnableAttesterResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgEnableAttesterResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgEnableAttesterResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgEnableAttesterResponse()
    return message
  }
}

function createBaseMsgDisableAttester() {
  return { from: '', attester: '' }
}

export const MsgDisableAttester = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.attester !== '') {
      writer.uint32(18).string(message.attester)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgDisableAttester()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.attester = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      attester: isSet(object.attester) ? String(object.attester) : ''
    }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.attester !== '') {
      obj.attester = message.attester
    }
    return obj
  },

  create(base) {
    return MsgDisableAttester.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgDisableAttester()
    message.from = object.from ?? ''
    message.attester = object.attester ?? ''
    return message
  }
}

function createBaseMsgDisableAttesterResponse() {
  return {}
}

export const MsgDisableAttesterResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgDisableAttesterResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgDisableAttesterResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgDisableAttesterResponse()
    return message
  }
}

function createBaseMsgPauseBurningAndMinting() {
  return { from: '' }
}

export const MsgPauseBurningAndMinting = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgPauseBurningAndMinting()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return { from: isSet(object.from) ? String(object.from) : '' }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    return obj
  },

  create(base) {
    return MsgPauseBurningAndMinting.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgPauseBurningAndMinting()
    message.from = object.from ?? ''
    return message
  }
}

function createBaseMsgPauseBurningAndMintingResponse() {
  return {}
}

export const MsgPauseBurningAndMintingResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgPauseBurningAndMintingResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgPauseBurningAndMintingResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgPauseBurningAndMintingResponse()
    return message
  }
}

function createBaseMsgUnpauseBurningAndMinting() {
  return { from: '' }
}

export const MsgUnpauseBurningAndMinting = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUnpauseBurningAndMinting()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return { from: isSet(object.from) ? String(object.from) : '' }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    return obj
  },

  create(base) {
    return MsgUnpauseBurningAndMinting.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgUnpauseBurningAndMinting()
    message.from = object.from ?? ''
    return message
  }
}

function createBaseMsgUnpauseBurningAndMintingResponse() {
  return {}
}

export const MsgUnpauseBurningAndMintingResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUnpauseBurningAndMintingResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgUnpauseBurningAndMintingResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgUnpauseBurningAndMintingResponse()
    return message
  }
}

function createBaseMsgPauseSendingAndReceivingMessages() {
  return { from: '' }
}

export const MsgPauseSendingAndReceivingMessages = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgPauseSendingAndReceivingMessages()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return { from: isSet(object.from) ? String(object.from) : '' }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    return obj
  },

  create(base) {
    return MsgPauseSendingAndReceivingMessages.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgPauseSendingAndReceivingMessages()
    message.from = object.from ?? ''
    return message
  }
}

function createBaseMsgPauseSendingAndReceivingMessagesResponse() {
  return {}
}

export const MsgPauseSendingAndReceivingMessagesResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgPauseSendingAndReceivingMessagesResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgPauseSendingAndReceivingMessagesResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgPauseSendingAndReceivingMessagesResponse()
    return message
  }
}

function createBaseMsgUnpauseSendingAndReceivingMessages() {
  return { from: '' }
}

export const MsgUnpauseSendingAndReceivingMessages = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUnpauseSendingAndReceivingMessages()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return { from: isSet(object.from) ? String(object.from) : '' }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    return obj
  },

  create(base) {
    return MsgUnpauseSendingAndReceivingMessages.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgUnpauseSendingAndReceivingMessages()
    message.from = object.from ?? ''
    return message
  }
}

function createBaseMsgUnpauseSendingAndReceivingMessagesResponse() {
  return {}
}

export const MsgUnpauseSendingAndReceivingMessagesResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUnpauseSendingAndReceivingMessagesResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgUnpauseSendingAndReceivingMessagesResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgUnpauseSendingAndReceivingMessagesResponse()
    return message
  }
}

function createBaseMsgUpdateMaxMessageBodySize() {
  return { from: '', messageSize: 0 }
}

export const MsgUpdateMaxMessageBodySize = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.messageSize !== 0) {
      writer.uint32(16).uint64(message.messageSize)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateMaxMessageBodySize()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 16) {
            break
          }
          message.messageSize = longToNumber(reader.uint64())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      messageSize: isSet(object.messageSize) ? Number(object.messageSize) : 0
    }
  },

  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.messageSize !== 0) {
      obj.messageSize = Math.round(message.messageSize)
    }
    return obj
  },

  create(base) {
    return MsgUpdateMaxMessageBodySize.fromPartial(base ?? {})
  },

  fromPartial(object) {
    const message = createBaseMsgUpdateMaxMessageBodySize()
    message.from = object.from ?? ''
    message.messageSize = object.messageSize ?? 0
    return message
  }
}

function createBaseMsgUpdateMaxMessageBodySizeResponse() {
  return {}
}

export const MsgUpdateMaxMessageBodySizeResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateMaxMessageBodySizeResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_) {
    return {}
  },

  toJSON(_) {
    const obj = {}
    return obj
  },

  create(base) {
    return MsgUpdateMaxMessageBodySizeResponse.fromPartial(base ?? {})
  },

  fromPartial(_) {
    const message = createBaseMsgUpdateMaxMessageBodySizeResponse()
    return message
  }
}

export const MsgSetMaxBurnAmountPerMessage = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.localToken !== '') {
      writer.uint32(18).string(message.localToken)
    }
    if (message.amount !== '') {
      writer.uint32(26).string(message.amount)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgSetMaxBurnAmountPerMessage()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.localToken = reader.string()
          continue
        case 3:
          if (tag !== 26) {
            break
          }
          message.amount = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      localToken: isSet(object.localToken) ? String(object.localToken) : '',
      amount: isSet(object.amount) ? String(object.amount) : ''
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.localToken !== '') {
      obj.localToken = message.localToken
    }
    if (message.amount !== '') {
      obj.amount = message.amount
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgSetMaxBurnAmountPerMessage()
    message.from = object.from !== undefined && object.from !== null ? object.from : ''
    message.localToken = object.localToken !== undefined && object.localToken !== null ? object.localToken : ''
    message.amount = object.amount !== undefined && object.amount !== null ? object.amount : ''
    return message
  }
}

function createBaseMsgSetMaxBurnAmountPerMessage() {
  return { from: '', localToken: '', amount: '' }
}

function createBaseMsgSetMaxBurnAmountPerMessageResponse() {
  return {}
}

export const MsgSetMaxBurnAmountPerMessageResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgSetMaxBurnAmountPerMessageResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(_) {
    return {}
  },
  toJSON(_) {
    const obj = {}
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(_) {
    const message = createBaseMsgSetMaxBurnAmountPerMessageResponse()
    return message
  }
}

function createBaseMsgDepositForBurn() {
  return {
    from: '',
    amount: '',
    destinationDomain: 0,
    mintRecipient: new Uint8Array(0),
    burnToken: ''
  }
}

export const MsgDepositForBurn = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.amount !== '') {
      writer.uint32(18).string(message.amount)
    }
    if (message.destinationDomain !== 0) {
      writer.uint32(24).uint32(message.destinationDomain)
    }
    if (message.mintRecipient.length !== 0) {
      writer.uint32(34).bytes(message.mintRecipient)
    }
    if (message.burnToken !== '') {
      writer.uint32(42).string(message.burnToken)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgDepositForBurn()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.amount = reader.string()
          continue
        case 3:
          if (tag !== 24) {
            break
          }
          message.destinationDomain = reader.uint32()
          continue
        case 4:
          if (tag !== 34) {
            break
          }
          message.mintRecipient = reader.bytes()
          continue
        case 5:
          if (tag !== 42) {
            break
          }
          message.burnToken = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      amount: isSet(object.amount) ? String(object.amount) : '',
      destinationDomain: isSet(object.destinationDomain) ? Number(object.destinationDomain) : 0,
      mintRecipient: isSet(object.mintRecipient) ? bytesFromBase64(object.mintRecipient) : new Uint8Array(0),
      burnToken: isSet(object.burnToken) ? String(object.burnToken) : ''
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.amount !== '') {
      obj.amount = message.amount
    }
    if (message.destinationDomain !== 0) {
      obj.destinationDomain = Math.round(message.destinationDomain)
    }
    if (message.mintRecipient.length !== 0) {
      obj.mintRecipient = base64FromBytes(message.mintRecipient)
    }
    if (message.burnToken !== '') {
      obj.burnToken = message.burnToken
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgDepositForBurn()
    message.from = object.from !== undefined && object.from !== null ? object.from : ''
    message.amount = object.amount !== undefined && object.amount !== null ? object.amount : ''
    message.destinationDomain =
      object.destinationDomain !== undefined && object.destinationDomain !== null ? object.destinationDomain : 0
    message.mintRecipient =
      object.mintRecipient !== undefined && object.mintRecipient !== null ? object.mintRecipient : new Uint8Array(0)
    message.burnToken = object.burnToken !== undefined && object.burnToken !== null ? object.burnToken : ''
    return message
  }
}

function createBaseMsgDepositForBurnResponse() {
  return { nonce: 0 }
}

export const MsgDepositForBurnResponse = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.nonce !== 0) {
      writer.uint32(8).uint64(message.nonce)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgDepositForBurnResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }
          message.nonce = longToNumber(reader.uint64())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return { nonce: isSet(object.nonce) ? Number(object.nonce) : 0 }
  },
  toJSON(message) {
    const obj = {}
    if (message.nonce !== 0) {
      obj.nonce = Math.round(message.nonce)
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgDepositForBurnResponse()
    message.nonce = object.nonce !== undefined && object.nonce !== null ? object.nonce : 0
    return message
  }
}

function createBaseMsgDepositForBurnWithCaller() {
  return {
    from: '',
    amount: '',
    destinationDomain: 0,
    mintRecipient: new Uint8Array(0),
    burnToken: '',
    destinationCaller: new Uint8Array(0)
  }
}

export const MsgDepositForBurnWithCaller = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.amount !== '') {
      writer.uint32(18).string(message.amount)
    }
    if (message.destinationDomain !== 0) {
      writer.uint32(24).uint32(message.destinationDomain)
    }
    if (message.mintRecipient.length !== 0) {
      writer.uint32(34).bytes(message.mintRecipient)
    }
    if (message.burnToken !== '') {
      writer.uint32(42).string(message.burnToken)
    }
    if (message.destinationCaller.length !== 0) {
      writer.uint32(50).bytes(message.destinationCaller)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgDepositForBurnWithCaller()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.amount = reader.string()
          continue
        case 3:
          if (tag !== 24) {
            break
          }
          message.destinationDomain = reader.uint32()
          continue
        case 4:
          if (tag !== 34) {
            break
          }
          message.mintRecipient = reader.bytes()
          continue
        case 5:
          if (tag !== 42) {
            break
          }
          message.burnToken = reader.string()
          continue
        case 6:
          if (tag !== 50) {
            break
          }
          message.destinationCaller = reader.bytes()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      amount: isSet(object.amount) ? String(object.amount) : '',
      destinationDomain: isSet(object.destinationDomain) ? Number(object.destinationDomain) : 0,
      mintRecipient: isSet(object.mintRecipient) ? bytesFromBase64(object.mintRecipient) : new Uint8Array(0),
      burnToken: isSet(object.burnToken) ? String(object.burnToken) : '',
      destinationCaller: isSet(object.destinationCaller) ? bytesFromBase64(object.destinationCaller) : new Uint8Array(0)
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.amount !== '') {
      obj.amount = message.amount
    }
    if (message.destinationDomain !== 0) {
      obj.destinationDomain = Math.round(message.destinationDomain)
    }
    if (message.mintRecipient.length !== 0) {
      obj.mintRecipient = base64FromBytes(message.mintRecipient)
    }
    if (message.burnToken !== '') {
      obj.burnToken = message.burnToken
    }
    if (message.destinationCaller.length !== 0) {
      obj.destinationCaller = base64FromBytes(message.destinationCaller)
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgDepositForBurnWithCaller()
    message.from = object.from !== undefined && object.from !== null ? object.from : ''
    message.amount = object.amount !== undefined && object.amount !== null ? object.amount : ''
    message.destinationDomain =
      object.destinationDomain !== undefined && object.destinationDomain !== null ? object.destinationDomain : 0
    message.mintRecipient =
      object.mintRecipient !== undefined && object.mintRecipient !== null ? object.mintRecipient : new Uint8Array(0)
    message.burnToken = object.burnToken !== undefined && object.burnToken !== null ? object.burnToken : ''
    message.destinationCaller =
      object.destinationCaller !== undefined && object.destinationCaller !== null
        ? object.destinationCaller
        : new Uint8Array(0)
    return message
  }
}

function createBaseMsgDepositForBurnWithCallerResponse() {
  return { nonce: 0 }
}

export const MsgDepositForBurnWithCallerResponse = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.nonce !== 0) {
      writer.uint32(8).uint64(message.nonce)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgDepositForBurnWithCallerResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }
          message.nonce = longToNumber(reader.uint64())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return { nonce: isSet(object.nonce) ? Number(object.nonce) : 0 }
  },
  toJSON(message) {
    const obj = {}
    if (message.nonce !== 0) {
      obj.nonce = Math.round(message.nonce)
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgDepositForBurnWithCallerResponse()
    message.nonce = object.nonce !== undefined && object.nonce !== null ? object.nonce : 0
    return message
  }
}

function createBaseMsgReplaceDepositForBurn() {
  return {
    from: '',
    originalMessage: new Uint8Array(0),
    originalAttestation: new Uint8Array(0),
    newDestinationCaller: new Uint8Array(0),
    newMintRecipient: new Uint8Array(0)
  }
}

export const MsgReplaceDepositForBurn = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.originalMessage.length !== 0) {
      writer.uint32(18).bytes(message.originalMessage)
    }
    if (message.originalAttestation.length !== 0) {
      writer.uint32(26).bytes(message.originalAttestation)
    }
    if (message.newDestinationCaller.length !== 0) {
      writer.uint32(34).bytes(message.newDestinationCaller)
    }
    if (message.newMintRecipient.length !== 0) {
      writer.uint32(42).bytes(message.newMintRecipient)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgReplaceDepositForBurn()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.originalMessage = reader.bytes()
          continue
        case 3:
          if (tag !== 26) {
            break
          }
          message.originalAttestation = reader.bytes()
          continue
        case 4:
          if (tag !== 34) {
            break
          }
          message.newDestinationCaller = reader.bytes()
          continue
        case 5:
          if (tag !== 42) {
            break
          }
          message.newMintRecipient = reader.bytes()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      originalMessage: isSet(object.originalMessage) ? bytesFromBase64(object.originalMessage) : new Uint8Array(0),
      originalAttestation: isSet(object.originalAttestation)
        ? bytesFromBase64(object.originalAttestation)
        : new Uint8Array(0),
      newDestinationCaller: isSet(object.newDestinationCaller)
        ? bytesFromBase64(object.newDestinationCaller)
        : new Uint8Array(0),
      newMintRecipient: isSet(object.newMintRecipient) ? bytesFromBase64(object.newMintRecipient) : new Uint8Array(0)
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.originalMessage.length !== 0) {
      obj.originalMessage = base64FromBytes(message.originalMessage)
    }
    if (message.originalAttestation.length !== 0) {
      obj.originalAttestation = base64FromBytes(message.originalAttestation)
    }
    if (message.newDestinationCaller.length !== 0) {
      obj.newDestinationCaller = base64FromBytes(message.newDestinationCaller)
    }
    if (message.newMintRecipient.length !== 0) {
      obj.newMintRecipient = base64FromBytes(message.newMintRecipient)
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgReplaceDepositForBurn()
    message.from = object.from !== undefined && object.from !== null ? object.from : ''
    message.originalMessage =
      object.originalMessage !== undefined && object.originalMessage !== null
        ? object.originalMessage
        : new Uint8Array(0)
    message.originalAttestation =
      object.originalAttestation !== undefined && object.originalAttestation !== null
        ? object.originalAttestation
        : new Uint8Array(0)
    message.newDestinationCaller =
      object.newDestinationCaller !== undefined && object.newDestinationCaller !== null
        ? object.newDestinationCaller
        : new Uint8Array(0)
    message.newMintRecipient =
      object.newMintRecipient !== undefined && object.newMintRecipient !== null
        ? object.newMintRecipient
        : new Uint8Array(0)
    return message
  }
}

function createBaseMsgReplaceDepositForBurnResponse() {
  return {}
}

export const MsgReplaceDepositForBurnResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgReplaceDepositForBurnResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(_) {
    return {}
  },
  toJSON(_) {
    const obj = {}
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(_) {
    const message = createBaseMsgReplaceDepositForBurnResponse()
    return message
  }
}

function createBaseMsgReceiveMessage() {
  return {
    from: '',
    message: new Uint8Array(0),
    attestation: new Uint8Array(0)
  }
}

export const MsgReceiveMessage = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.message.length !== 0) {
      writer.uint32(18).bytes(message.message)
    }
    if (message.attestation.length !== 0) {
      writer.uint32(26).bytes(message.attestation)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgReceiveMessage()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }
          message.message = reader.bytes()
          continue
        case 3:
          if (tag !== 26) {
            break
          }
          message.attestation = reader.bytes()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      message: isSet(object.message) ? bytesFromBase64(object.message) : new Uint8Array(0),
      attestation: isSet(object.attestation) ? bytesFromBase64(object.attestation) : new Uint8Array(0)
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.message.length !== 0) {
      obj.message = base64FromBytes(message.message)
    }
    if (message.attestation.length !== 0) {
      obj.attestation = base64FromBytes(message.attestation)
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgReceiveMessage()
    message.from = object.from !== undefined && object.from !== null ? object.from : ''
    message.message = object.message !== undefined && object.message !== null ? object.message : new Uint8Array(0)
    message.attestation =
      object.attestation !== undefined && object.attestation !== null ? object.attestation : new Uint8Array(0)
    return message
  }
}

function createBaseMsgReceiveMessageResponse() {
  return { success: false }
}

export const MsgReceiveMessageResponse = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.success === true) {
      writer.uint32(8).bool(message.success)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgReceiveMessageResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }
          message.success = reader.bool()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.success === true) {
      obj.success = message.success
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgReceiveMessageResponse()
    message.success = object.success !== undefined && object.success !== null ? object.success : false
    return message
  }
}

function createBaseMsgSendMessage() {
  return {
    from: '',
    destinationDomain: 0,
    recipient: new Uint8Array(0),
    messageBody: new Uint8Array(0)
  }
}

export const MsgSendMessage = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.destinationDomain !== 0) {
      writer.uint32(16).uint32(message.destinationDomain)
    }
    if (message.recipient.length !== 0) {
      writer.uint32(26).bytes(message.recipient)
    }
    if (message.messageBody.length !== 0) {
      writer.uint32(34).bytes(message.messageBody)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgSendMessage()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 16) {
            break
          }
          message.destinationDomain = reader.uint32()
          continue
        case 3:
          if (tag !== 26) {
            break
          }
          message.recipient = reader.bytes()
          continue
        case 4:
          if (tag !== 34) {
            break
          }
          message.messageBody = reader.bytes()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      destinationDomain: isSet(object.destinationDomain) ? Number(object.destinationDomain) : 0,
      recipient: isSet(object.recipient) ? bytesFromBase64(object.recipient) : new Uint8Array(0),
      messageBody: isSet(object.messageBody) ? bytesFromBase64(object.messageBody) : new Uint8Array(0)
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.destinationDomain !== 0) {
      obj.destinationDomain = Math.round(message.destinationDomain)
    }
    if (message.recipient.length !== 0) {
      obj.recipient = base64FromBytes(message.recipient)
    }
    if (message.messageBody.length !== 0) {
      obj.messageBody = base64FromBytes(message.messageBody)
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgSendMessage()
    message.from = object.from !== undefined && object.from !== null ? object.from : ''
    message.destinationDomain =
      object.destinationDomain !== undefined && object.destinationDomain !== null ? object.destinationDomain : 0
    message.recipient =
      object.recipient !== undefined && object.recipient !== null ? object.recipient : new Uint8Array(0)
    message.messageBody =
      object.messageBody !== undefined && object.messageBody !== null ? object.messageBody : new Uint8Array(0)
    return message
  }
}

function createBaseMsgSendMessageResponse() {
  return { nonce: 0 }
}

export const MsgSendMessageResponse = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.nonce !== 0) {
      writer.uint32(8).uint64(message.nonce)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgSendMessageResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }
          message.nonce = longToNumber(reader.uint64())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return { nonce: isSet(object.nonce) ? Number(object.nonce) : 0 }
  },
  toJSON(message) {
    const obj = {}
    if (message.nonce !== 0) {
      obj.nonce = Math.round(message.nonce)
    }
    return obj
  },
  create(base) {
    return fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgSendMessageResponse()
    message.nonce = object.nonce !== undefined && object.nonce !== null ? object.nonce : 0
    return message
  }
}

function createBaseMsgSendMessageWithCaller() {
  return {
    from: '',
    destinationDomain: 0,
    recipient: new Uint8Array(0),
    messageBody: new Uint8Array(0),
    destinationCaller: new Uint8Array(0)
  }
}

export const MsgSendMessageWithCaller = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.destinationDomain !== 0) {
      writer.uint32(16).uint32(message.destinationDomain)
    }
    if (message.recipient.length !== 0) {
      writer.uint32(26).bytes(message.recipient)
    }
    if (message.messageBody.length !== 0) {
      writer.uint32(34).bytes(message.messageBody)
    }
    if (message.destinationCaller.length !== 0) {
      writer.uint32(42).bytes(message.destinationCaller)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgSendMessageWithCaller()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 16) {
            break
          }
          message.destinationDomain = reader.uint32()
          continue
        case 3:
          if (tag !== 26) {
            break
          }
          message.recipient = reader.bytes()
          continue
        case 4:
          if (tag !== 34) {
            break
          }
          message.messageBody = reader.bytes()
          continue
        case 5:
          if (tag !== 42) {
            break
          }
          message.destinationCaller = reader.bytes()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      destinationDomain: isSet(object.destinationDomain) ? Number(object.destinationDomain) : 0,
      recipient: isSet(object.recipient) ? bytesFromBase64(object.recipient) : new Uint8Array(0),
      messageBody: isSet(object.messageBody) ? bytesFromBase64(object.messageBody) : new Uint8Array(0),
      destinationCaller: isSet(object.destinationCaller) ? bytesFromBase64(object.destinationCaller) : new Uint8Array(0)
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.destinationDomain !== 0) {
      obj.destinationDomain = Math.round(message.destinationDomain)
    }
    if (message.recipient.length !== 0) {
      obj.recipient = base64FromBytes(message.recipient)
    }
    if (message.messageBody.length !== 0) {
      obj.messageBody = base64FromBytes(message.messageBody)
    }
    if (message.destinationCaller.length !== 0) {
      obj.destinationCaller = base64FromBytes(message.destinationCaller)
    }
    return obj
  },
  create(base) {
    return MsgSendMessageWithCaller.fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgSendMessageWithCaller()
    message.from = object.from !== undefined && object.from !== null ? object.from : ''
    message.destinationDomain =
      object.destinationDomain !== undefined && object.destinationDomain !== null ? object.destinationDomain : 0
    message.recipient =
      object.recipient !== undefined && object.recipient !== null ? object.recipient : new Uint8Array(0)
    message.messageBody =
      object.messageBody !== undefined && object.messageBody !== null ? object.messageBody : new Uint8Array(0)
    message.destinationCaller =
      object.destinationCaller !== undefined && object.destinationCaller !== null
        ? object.destinationCaller
        : new Uint8Array(0)
    return message
  }
}

function createBaseMsgSendMessageWithCallerResponse() {
  return { nonce: 0 }
}

export const MsgSendMessageWithCallerResponse = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.nonce !== 0) {
      writer.uint32(8).uint64(message.nonce)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgSendMessageWithCallerResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }
          message.nonce = longToNumber(reader.uint64())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return { nonce: isSet(object.nonce) ? Number(object.nonce) : 0 }
  },
  toJSON(message) {
    const obj = {}
    if (message.nonce !== 0) {
      obj.nonce = Math.round(message.nonce)
    }
    return obj
  },
  create(base) {
    return MsgSendMessageWithCallerResponse.fromPartial(base != null ? base : {})
  },
  fromPartial(object) {
    const message = createBaseMsgSendMessageWithCallerResponse()
    message.nonce = object.nonce !== undefined && object.nonce !== null ? object.nonce : 0
    return message
  }
}

function createBaseMsgReplaceMessage() {
  return {
    from: '',
    originalMessage: new Uint8Array(0),
    originalAttestation: new Uint8Array(0),
    newMessageBody: new Uint8Array(0),
    newDestinationCaller: new Uint8Array(0)
  }
}

export const MsgReplaceMessage = {
  encode: function (message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.originalMessage.length !== 0) {
      writer.uint32(18).bytes(message.originalMessage)
    }
    if (message.originalAttestation.length !== 0) {
      writer.uint32(26).bytes(message.originalAttestation)
    }
    if (message.newMessageBody.length !== 0) {
      writer.uint32(34).bytes(message.newMessageBody)
    }
    if (message.newDestinationCaller.length !== 0) {
      writer.uint32(42).bytes(message.newDestinationCaller)
    }
    return writer
  },
  decode: function (input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgReplaceMessage()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) break
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 18) break
          message.originalMessage = reader.bytes()
          continue
        case 3:
          if (tag !== 26) break
          message.originalAttestation = reader.bytes()
          continue
        case 4:
          if (tag !== 34) break
          message.newMessageBody = reader.bytes()
          continue
        case 5:
          if (tag !== 42) break
          message.newDestinationCaller = reader.bytes()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) break
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON: function (object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      originalMessage: isSet(object.originalMessage) ? bytesFromBase64(object.originalMessage) : new Uint8Array(0),
      originalAttestation: isSet(object.originalAttestation)
        ? bytesFromBase64(object.originalAttestation)
        : new Uint8Array(0),
      newMessageBody: isSet(object.newMessageBody) ? bytesFromBase64(object.newMessageBody) : new Uint8Array(0),
      newDestinationCaller: isSet(object.newDestinationCaller)
        ? bytesFromBase64(object.newDestinationCaller)
        : new Uint8Array(0)
    }
  },
  toJSON: function (message) {
    const obj = {}
    if (message.from !== '') obj.from = message.from
    if (message.originalMessage.length !== 0) obj.originalMessage = base64FromBytes(message.originalMessage)
    if (message.originalAttestation.length !== 0) obj.originalAttestation = base64FromBytes(message.originalAttestation)
    if (message.newMessageBody.length !== 0) obj.newMessageBody = base64FromBytes(message.newMessageBody)
    if (message.newDestinationCaller.length !== 0)
      obj.newDestinationCaller = base64FromBytes(message.newDestinationCaller)
    return obj
  },
  create: function (base) {
    return MsgReplaceMessage.fromPartial(base != null ? base : {})
  },
  fromPartial: function (object) {
    const message = createBaseMsgReplaceMessage()
    message.from = object.from != null ? object.from : ''
    message.originalMessage = object.originalMessage != null ? object.originalMessage : new Uint8Array(0)
    message.originalAttestation = object.originalAttestation != null ? object.originalAttestation : new Uint8Array(0)
    message.newMessageBody = object.newMessageBody != null ? object.newMessageBody : new Uint8Array(0)
    message.newDestinationCaller = object.newDestinationCaller != null ? object.newDestinationCaller : new Uint8Array(0)
    return message
  }
}

function createBaseMsgReplaceMessageResponse() {
  return {}
}

export const MsgReplaceMessageResponse = {
  encode: function (_, writer = _m0.Writer.create()) {
    return writer
  },
  decode: function (input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgReplaceMessageResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) break
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON: function (_) {
    return {}
  },
  toJSON: function (_) {
    return {}
  },
  create: function (base) {
    return MsgReplaceMessageResponse.fromPartial(base != null ? base : {})
  },
  fromPartial: function (_) {
    const message = createBaseMsgReplaceMessageResponse()
    return message
  }
}

function createBaseMsgUpdateSignatureThreshold() {
  return { from: '', amount: 0 }
}

export const MsgUpdateSignatureThreshold = {
  encode: function (message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.amount !== 0) {
      writer.uint32(16).uint32(message.amount)
    }
    return writer
  },
  decode: function (input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateSignatureThreshold()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) break
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 16) break
          message.amount = reader.uint32()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) break
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON: function (object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      amount: isSet(object.amount) ? Number(object.amount) : 0
    }
  },
  toJSON: function (message) {
    const obj = {}
    if (message.from !== '') obj.from = message.from
    if (message.amount !== 0) obj.amount = Math.round(message.amount)
    return obj
  },
  create: function (base) {
    return MsgUpdateSignatureThreshold.fromPartial(base != null ? base : {})
  },
  fromPartial: function (object) {
    const message = createBaseMsgUpdateSignatureThreshold()
    message.from = object.from != null ? object.from : ''
    message.amount = object.amount != null ? object.amount : 0
    return message
  }
}

function createBaseMsgUpdateSignatureThresholdResponse() {
  return {}
}

export const MsgUpdateSignatureThresholdResponse = {
  encode: function (_, writer = _m0.Writer.create()) {
    return writer
  },
  decode: function (input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUpdateSignatureThresholdResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) break
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON: function (_) {
    return {}
  },
  toJSON: function (_) {
    return {}
  },
  create: function (base) {
    return MsgUpdateSignatureThresholdResponse.fromPartial(base != null ? base : {})
  },
  fromPartial: function (_) {
    const message = createBaseMsgUpdateSignatureThresholdResponse()
    return message
  }
}

function createBaseMsgLinkTokenPair() {
  return {
    from: '',
    remoteDomain: 0,
    remoteToken: new Uint8Array(0),
    localToken: ''
  }
}

export const MsgLinkTokenPair = {
  encode: function (message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.remoteDomain !== 0) {
      writer.uint32(16).uint32(message.remoteDomain)
    }
    if (message.remoteToken.length !== 0) {
      writer.uint32(26).bytes(message.remoteToken)
    }
    if (message.localToken !== '') {
      writer.uint32(34).string(message.localToken)
    }
    return writer
  },
  decode: function (input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgLinkTokenPair()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) break
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 16) break
          message.remoteDomain = reader.uint32()
          continue
        case 3:
          if (tag !== 26) break
          message.remoteToken = reader.bytes()
          continue
        case 4:
          if (tag !== 34) break
          message.localToken = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) break
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON: function (object) {
    return {
      from: isSet(object.from) ? String(object.from) : '',
      remoteDomain: isSet(object.remoteDomain) ? Number(object.remoteDomain) : 0,
      remoteToken: isSet(object.remoteToken) ? bytesFromBase64(object.remoteToken) : new Uint8Array(0),
      localToken: isSet(object.localToken) ? String(object.localToken) : ''
    }
  },
  toJSON: function (message) {
    const obj = {}
    if (message.from !== '') obj.from = message.from
    if (message.remoteDomain !== 0) obj.remoteDomain = Math.round(message.remoteDomain)
    if (message.remoteToken.length !== 0) obj.remoteToken = base64FromBytes(message.remoteToken)
    if (message.localToken !== '') obj.localToken = message.localToken
    return obj
  },
  create: function (base) {
    return MsgLinkTokenPair.fromPartial(base != null ? base : {})
  },
  fromPartial: function (object) {
    const message = createBaseMsgLinkTokenPair()
    message.from = object.from != null ? object.from : ''
    message.remoteDomain = object.remoteDomain != null ? object.remoteDomain : 0
    message.remoteToken = object.remoteToken != null ? object.remoteToken : new Uint8Array(0)
    message.localToken = object.localToken != null ? object.localToken : ''
    return message
  }
}

function createBaseMsgLinkTokenPairResponse() {
  return {}
}

export const MsgLinkTokenPairResponse = {
  encode: function (_, writer = _m0.Writer.create()) {
    return writer
  },
  decode: function (input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgLinkTokenPairResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) break
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON: function (_) {
    return {}
  },
  toJSON: function (_) {
    return {}
  },
  create: function (base) {
    return MsgLinkTokenPairResponse.fromPartial(base != null ? base : {})
  },
  fromPartial: function (_) {
    const message = createBaseMsgLinkTokenPairResponse()
    return message
  }
}

function createBaseMsgUnlinkTokenPair() {
  return {
    from: '',
    remoteDomain: 0,
    remoteToken: new Uint8Array(0),
    localToken: ''
  }
}

export const MsgUnlinkTokenPair = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.remoteDomain !== 0) {
      writer.uint32(16).uint32(message.remoteDomain)
    }
    if (message.remoteToken.length !== 0) {
      writer.uint32(26).bytes(message.remoteToken)
    }
    if (message.localToken !== '') {
      writer.uint32(34).string(message.localToken)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUnlinkTokenPair()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 16) {
            break
          }
          message.remoteDomain = reader.uint32()
          continue
        case 3:
          if (tag !== 26) {
            break
          }
          message.remoteToken = reader.bytes()
          continue
        case 4:
          if (tag !== 34) {
            break
          }
          message.localToken = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? globalThis.String(object.from) : '',
      remoteDomain: isSet(object.remoteDomain) ? globalThis.Number(object.remoteDomain) : 0,
      remoteToken: isSet(object.remoteToken) ? bytesFromBase64(object.remoteToken) : new Uint8Array(0),
      localToken: isSet(object.localToken) ? globalThis.String(object.localToken) : ''
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.remoteDomain !== 0) {
      obj.remoteDomain = Math.round(message.remoteDomain)
    }
    if (message.remoteToken.length !== 0) {
      obj.remoteToken = base64FromBytes(message.remoteToken)
    }
    if (message.localToken !== '') {
      obj.localToken = message.localToken
    }
    return obj
  },
  create(base) {
    return MsgUnlinkTokenPair.fromPartial(base !== null && base !== void 0 ? base : {})
  },
  fromPartial(object) {
    var _a, _b, _c, _d
    const message = createBaseMsgUnlinkTokenPair()
    message.from = (_a = object.from) !== null && _a !== void 0 ? _a : ''
    message.remoteDomain = (_b = object.remoteDomain) !== null && _b !== void 0 ? _b : 0
    message.remoteToken = (_c = object.remoteToken) !== null && _c !== void 0 ? _c : new Uint8Array(0)
    message.localToken = (_d = object.localToken) !== null && _d !== void 0 ? _d : ''
    return message
  }
}

function createBaseMsgUnlinkTokenPairResponse() {
  return {}
}

export const MsgUnlinkTokenPairResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgUnlinkTokenPairResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(_) {
    return {}
  },
  toJSON(_) {
    const obj = {}
    return obj
  },
  create(base) {
    return MsgUnlinkTokenPairResponse.fromPartial(base !== null && base !== void 0 ? base : {})
  },
  fromPartial(_) {
    const message = createBaseMsgUnlinkTokenPairResponse()
    return message
  }
}

function createBaseMsgAddRemoteTokenMessenger() {
  return { from: '', domainId: 0, address: new Uint8Array(0) }
}

export const MsgAddRemoteTokenMessenger = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.domainId !== 0) {
      writer.uint32(16).uint32(message.domainId)
    }
    if (message.address.length !== 0) {
      writer.uint32(26).bytes(message.address)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgAddRemoteTokenMessenger()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 16) {
            break
          }
          message.domainId = reader.uint32()
          continue
        case 3:
          if (tag !== 26) {
            break
          }
          message.address = reader.bytes()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? globalThis.String(object.from) : '',
      domainId: isSet(object.domainId) ? globalThis.Number(object.domainId) : 0,
      address: isSet(object.address) ? bytesFromBase64(object.address) : new Uint8Array(0)
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.domainId !== 0) {
      obj.domainId = Math.round(message.domainId)
    }
    if (message.address.length !== 0) {
      obj.address = base64FromBytes(message.address)
    }
    return obj
  },
  create(base) {
    return MsgAddRemoteTokenMessenger.fromPartial(base !== null && base !== void 0 ? base : {})
  },
  fromPartial(object) {
    var _a, _b, _c
    const message = createBaseMsgAddRemoteTokenMessenger()
    message.from = (_a = object.from) !== null && _a !== void 0 ? _a : ''
    message.domainId = (_b = object.domainId) !== null && _b !== void 0 ? _b : 0
    message.address = (_c = object.address) !== null && _c !== void 0 ? _c : new Uint8Array(0)
    return message
  }
}

function createBaseMsgAddRemoteTokenMessengerResponse() {
  return {}
}

export const MsgAddRemoteTokenMessengerResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgAddRemoteTokenMessengerResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(_) {
    return {}
  },
  toJSON(_) {
    const obj = {}
    return obj
  },
  create(base) {
    return MsgAddRemoteTokenMessengerResponse.fromPartial(base !== null && base !== void 0 ? base : {})
  },
  fromPartial(_) {
    const message = createBaseMsgAddRemoteTokenMessengerResponse()
    return message
  }
}

function createBaseMsgRemoveRemoteTokenMessenger() {
  return { from: '', domainId: 0 }
}

export const MsgRemoveRemoteTokenMessenger = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.from !== '') {
      writer.uint32(10).string(message.from)
    }
    if (message.domainId !== 0) {
      writer.uint32(16).uint32(message.domainId)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgRemoveRemoteTokenMessenger()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }
          message.from = reader.string()
          continue
        case 2:
          if (tag !== 16) {
            break
          }
          message.domainId = reader.uint32()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(object) {
    return {
      from: isSet(object.from) ? globalThis.String(object.from) : '',
      domainId: isSet(object.domainId) ? globalThis.Number(object.domainId) : 0
    }
  },
  toJSON(message) {
    const obj = {}
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.domainId !== 0) {
      obj.domainId = Math.round(message.domainId)
    }
    return obj
  },
  create(base) {
    return MsgRemoveRemoteTokenMessenger.fromPartial(base !== null && base !== void 0 ? base : {})
  },
  fromPartial(object) {
    var _a, _b
    const message = createBaseMsgRemoveRemoteTokenMessenger()
    message.from = (_a = object.from) !== null && _a !== void 0 ? _a : ''
    message.domainId = (_b = object.domainId) !== null && _b !== void 0 ? _b : 0
    return message
  }
}

function createBaseMsgRemoveRemoteTokenMessengerResponse() {
  return {}
}

export const MsgRemoveRemoteTokenMessengerResponse = {
  encode(_, writer = _m0.Writer.create()) {
    return writer
  },
  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgRemoveRemoteTokenMessengerResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
  fromJSON(_) {
    return {}
  },
  toJSON(_) {
    const obj = {}
    return obj
  },
  create(base) {
    return MsgRemoveRemoteTokenMessengerResponse.fromPartial(base !== null && base !== void 0 ? base : {})
  },
  fromPartial(_) {
    const message = createBaseMsgRemoveRemoteTokenMessengerResponse()
    return message
  }
}

function bytesFromBase64(b64) {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, 'base64'))
  } else {
    const bin = globalThis.atob(b64)
    const arr = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i)
    }
    return arr
  }
}

function base64FromBytes(arr) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString('base64')
  } else {
    const bin = []
    arr.forEach(byte => {
      bin.push(String.fromCharCode(byte))
    })
    return globalThis.btoa(bin.join(''))
  }
}

function longToNumber(long) {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('Value is larger than Number.MAX_SAFE_INTEGER')
  }
  return long.toNumber()
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long
  _m0.configure()
}

function isSet(value) {
  return value !== null && value !== undefined
}
