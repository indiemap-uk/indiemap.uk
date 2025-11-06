import type {BusinessIdType} from '#business/index.js'
import {CRUDRepositoryPostgres} from '#db/CRUDRepositoryPostgres.js'
import {businessLocations, locations} from '#db/schema/schema.js'
import {eq} from 'drizzle-orm'
import * as v from 'valibot'
import type {LocationRepository} from './LocationRepository.js'
import {LocationCreateSchema, LocationSchema, newLocationId} from './LocationSchema.js'
import type {LocationCreateType, LocationIdType, LocationType} from './LocationType.js'

export class LocationRepositoryPostgres extends CRUDRepositoryPostgres implements LocationRepository {
  async create(data: LocationCreateType) {
    const validatedData = v.parse(LocationCreateSchema, data)
    const id = newLocationId()

    const toInsert = {
      id: id.toString(),
      address: validatedData.address,
      label: validatedData.label ?? '',
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
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
        ...locationResult,
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

    return records.map((r) => v.parse(LocationSchema, r))
  }

  async update(data: LocationType) {
    const toUpdate = v.parse(LocationSchema, data)

    await this.db
      .update(locations)
      .set(toUpdate)
      .where(eq(locations.id, data.id.toString()))

    return data
  }
}
