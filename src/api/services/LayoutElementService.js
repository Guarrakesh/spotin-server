const { LayoutElement, FIELD_TYPES, ELEMENT_TYPES } = require('../models/layoutelement.model');
const { AppLayoutBlock } = require('../models/applayoutblock.model');
const BaseMongoService = require('./BaseMongoService');
const { pick } = require('lodash');
class LayoutElementService  {

  async getLayoutElementTypes(filter = {}) {
    return LayoutElement.find(filter);
  }

  async getLayoutElementTypeById(id) {
    return LayoutElement.findById(id);
  }

  async getAppLayoutBlockById(id) {
    return AppLayoutBlock.findById(id);
  }

  async createAppLayoutBlock(lblock) {
    const validation = await this.validateAppLayoutBlock(lblock);

    if (!validation.result) {
      return validation;
    }

    const layoutBlock = await AppLayoutBlock.create(lblock);

    return {
      ...validation,
      layoutBlock,
    }
  }

  async updateAppLayoutBlock(lblock) {
    const validation = this.validateAppLayoutBlock(lblock);
    if (!validation.result) {
      return validation;
    }

    await AppLayoutBlock.updateOne({ _id: lblock._id }, lblock).exec();
    return {
      ...validation,
      layoutBlock: lblock,
    }
  }



  async getAppLayoutBlocks(filter) {
    return await AppLayoutBlock.find(filter);
  }
  async getAppLayoutBlockById(id) {
    return await AppLayoutBlock.findById(id);
  }
  async getAppLayoutBlockByScreenAndOrder(screen, order = 0) {
    return await AppLayoutBlock.find({ screen, order });
  }


  async validateAppLayoutBlock(lblock) {
    const fieldErrors = {};
    const errors = [];
    // Check firstly if the correct data has been passed
    if (!lblock.elementTypeId) {
      errors.push('ElementType is not specified.');
    }
    if (!lblock.screen) {
      errors.push('Screen is not specified.');
    }
    if (!lblock.order || !Number.isFinite(lblock.order)) {
      errors.push("Order is not specified or it's not a valid number");
    }
    if (errors.length > 0) {
      return {
        result: false,
        errors,
        fieldErrors,
      }
    }
    // Check if layoutblock already exists
    const data = pick(lblock, ['screen', 'order', 'beforeElementIdentifier', 'afterElementIdentifier']);
    const existingBlock = await AppLayoutBlock.find(data);
    if (existingBlock.length > 0) {

      errors.push(`AppLayout block already exists for screen ${lblock.screen} at order ${lblock.order}`);
    } else {

      const layoutElement = await LayoutElement.findOne({ _id: lblock.elementTypeId});
      if (!layoutElement) {
        errors.push(`The layout element ${lblock.elementType} does not exists.`);
      } else {
        for (const field of layoutElement.fields) {

          const [valid, msg] = this.validateField(lblock.fields[field.name], field);
          if (!valid) {
            fieldErrors[field.name] = [msg];
          }
        }
      }

    }

    return {
      result: (Object.keys(fieldErrors).length === 0 && errors.length === 0),
      errors,
      fieldErrors
    };
  }

  /**
   *
   * @param fieldData
   * @param field
   * @return {[boolean|msg]}
   */
  validateField(fieldData, field) {
    if (!fieldData) {
      if (field.required) {
        return [false, `Field ${field.name} is required.`];
      } else {
        return [true, null];
      }
    }

    switch (field.fieldType.toString()) {
      case FIELD_TYPES.TEXT_BOX:
      case FIELD_TYPES.TEXTAREA:
      case FIELD_TYPES.COLOR: {
        const valid = typeof fieldData === 'string';
        return [valid, valid ? `Field ${field.name} must be a string, ${typeof fieldData} given.` : null];
      }
      case FIELD_TYPES.NUMBER: {
        const valid = Number.isFinite(fieldData);
        return [valid, valid ? `Field ${field.name} must be a number, ${typeof fieldData} given.` : null];
      }
      case FIELD_TYPES.RANGE: {
        const valid = Array.isArray(fieldData)
            && fieldData.length === 2
            && Number.isFinite(fieldData[0])
            && Number.isFinite(fieldData[1])
            && fieldData[0] < fieldData[1];
        return [valid, valid ? `Field ${field.name} is not a valid range.`: null];
      }
      case FIELD_TYPES.IMAGE_URL: {
        const valid = typeof fieldData === 'string' && /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(fieldData);
        return [valid, !valid ?`Field ${field.name} must be a valid URL.`: null];
      }
      case FIELD_TYPES.ARRAY: {
        let valid = Array.isArray(fieldData);
        if (valid) {
          valid = valid && fieldData.filter((el) => !this.validateField(el, field.arrayElement)[0]).length === 0;
        }
        return [valid, valid ?`Field ${field.name} is not a valid array.`: null];
      }
      case FIELD_TYPES.GROUP: {
        for (const subField of field.subElements) {

          if ((subField.required && !fieldData[subField.name])|| (fieldData[subField.name] && !this.validateField(fieldData[subField.name], subField)[0])) {
            return [false, `Field ${field.name} and/or its subfields are not valid.`];
          }
        }
        return [true, null]
      }

      default:
        return [false, 'Invalid element type']

    }
  }


}


exports.LayoutElementService = LayoutElementService;
