// src/validations/notesValidation.js

import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectIdValidator = (value, helpers) =>
  !isValidObjectId(value) ? helpers.message('Invalid id format') : value;

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    tag: Joi.string()
      .pattern(/[A-Z][a-z]+/)
      .valid(...TAGS),
    search: Joi.string().trim().allow('').messages({
      'string.base': 'Search must be a string',
      'string.trim': 'Search should not contain whitespace around it.',
    }),
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer number',
      'number.min': 'Page should not be lower than {#limit}',
    }),
    perPage: Joi.number().integer().min(5).max(20).default(10).messages({
      'number.base': 'PerPage must be a number',
      'number.integer': 'PerPage must be an integer number',
      'number.min': 'PerPage should be at least {#limit}',
      'number.max': 'PerPage should not be more than {#limit}',
    }),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      'string.base': 'NoteId must be a string',
      'any.required': 'NoteId is required',
    }),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .pattern(/[A-Z][a-z]+/)
      .valid(...TAGS)
      .messages({
        'string.base': 'Tag must be a string',
        'string.pattern.base': 'Tag must start with capital letter',
        'any.only': `Tag must be one of: {...TAGS}`,
      }),
  }),
};

export const updateNoteSchema = {
  ...noteIdSchema,
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .pattern(/[A-Z][a-z]+/)
      .valid(...TAGS)
      .messages({
        'string.base': 'Tag must be a string',
        'string.pattern.base': 'Tag must start with capital letter',
        'any.only': `Tag must be one of: {...TAGS}`,
      }),
  })
    .min(1)
    .messages({
      'object.min': 'At least {#limit} field should be provided for update',
    }),
};
