import {describe, expect, test} from 'vitest'

import {isInsideUK} from './UK'

describe('isInsideUK', () => {
	test('returns true for point inside UK bounds', () => {
		expect(isInsideUK(52.5, -1.9)).toBe(true)
	})

	test('returns false for point too far north', () => {
		expect(isInsideUK(61, -1.9)).toBe(false)
	})

	test('returns false for point too far south', () => {
		expect(isInsideUK(45, -1.9)).toBe(false)
	})

	test('returns false for point too far east', () => {
		expect(isInsideUK(52.5, 2)).toBe(false)
	})

	test('returns false for point too far west', () => {
		expect(isInsideUK(52.5, -9)).toBe(false)
	})

	test('returns true for point exactly on SW boundary', () => {
		expect(isInsideUK(46.0, -8.5)).toBe(true)
	})

	test('returns true for point exactly on NE boundary', () => {
		expect(isInsideUK(60.0, 1.9)).toBe(true)
	})
})
