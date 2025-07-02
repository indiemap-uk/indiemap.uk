import type {BusinessIdType} from '@i/core/business'

import {
  type LocationCreateType,
  type LocationIdType,
  type LocationRepository,
  type LocationType,
  LocationSchema,
  newLocationId,
} from '@i/core/location'
import {eq} from 'drizzle-orm'
import * as v from 'valibot'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {businessLocations, locations} from './db/schema/schema.js'

export class LocationRepositoryPostgres extends CRUDRepositoryPostgres implements LocationRepository {
  async create(data: LocationCreateType) {
    const validatedData = v.parse(LocationSchema, data)
    const id = newLocationId()

    const toInsert = {
      id: id.toString(),
      address: validatedData.address,
      label: validatedData.label ?? '',
      latitude: validatedData.latitude.toString(),
      longitude: validatedData.longitude.toString(),
    }

    return await this.db.transaction(async (tx) => {
      const locationRecord = await tx
        .insert(locations)
        .values(toInsert)
        .returning()

      const locationResult = this.ensure1(locationRecord)

      await tx
        .insert(businessLocations)
        .values({
          businessId: data.businessId.toString(),
          locationId: locationResult.id,
        })

      return v.parse(LocationSchema, {
        id: locationResult.id,
        address: locationResult.address,
        label: locationResult.label,
        latitude: parseFloat(locationResult.latitude ?? '0'),
        longitude: parseFloat(locationResult.longitude ?? '0'),
        businessId: data.businessId,
      })
    })
  }

  async delete(id: LocationIdType) {
    await this.db
      .delete(locations)
      .where(eq(locations.id, id.toString()))
  }

  async getByBusinessId(id: BusinessIdType) {
    const records = await this.db
      .select({
        id: locations.id,
        address: locations.address,
        label: locations.label,
        latitude: locations.latitude,
        longitude: locations.longitude,
        businessId: businessLocations.businessId,
      })
      .from(locations)
      .innerJoin(businessLocations, eq(locations.id, businessLocations.locationId))
      .where(eq(businessLocations.businessId, id.toString()))

    return records.map((r) =>
      v.parse(LocationSchema, {
        id: r.id,
        address: r.address,
        label: r.label,
        latitude: parseFloat(r.latitude ?? '0'),
        longitude: parseFloat(r.longitude ?? '0'),
        businessId: r.businessId,
      })
    )
  }

  async update(data: LocationType) {
    const validatedData = v.parse(LocationSchema, data)

    const toUpdate = {
      address: validatedData.address,
      label: validatedData.label,
      latitude: validatedData.latitude.toString(),
      longitude: validatedData.longitude.toString(),
    }

    await this.db
      .update(locations)
      .set(toUpdate)
      .where(eq(locations.id, data.id.toString()))

    return data
  }
}
