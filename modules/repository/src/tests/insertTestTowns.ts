import type {Pool} from 'pg'
import * as db from 'zapatos/db'

export const insertTestTowns = async (pool: Pool) => {
	await db.sql`
	INSERT INTO "public"."towns" VALUES
  (1,'Aaron''s Hill','Surrey','England','SU957435',495783,143522,51.18291,-0.63098,78,'GU7 2','Waverley District','South East','Suburban Area'),
  (2,'Abbas Combe','Somerset','England','ST707226',370749,122688,51.00283,-2.41825,91,'BA8 0','Somerset','South West','Village'),
  (3,'Abberley','Worcestershire','England','SO744675',374477,267522,52.30522,-2.37574,152,'WR6 6','Malvern Hills District','West Midlands','Village'),
  (4,'Abberton','Essex','England','TM006190',600637,219093,51.83440,0.91066,44,'CO5 7','Colchester District','Eastern','Village'),
  (5,'Abberton','Worcestershire','England','SO995534',399538,253477,52.17955,-2.00817,68,'WR10 2','Wychavon District','West Midlands','Hamlet'),
  (6,'Abberwick','Northumberland','England','NU129132',412938,613277,55.41325,-1.79720,93,'NE66 2','Northumberland','North East','Locality'),
  (7,'Abbess End','Essex','England','TL575115',557500,211500,51.78000,0.28172,75,'CM5 0','Epping Forest District','Eastern','Locality'),
  (8,'Abbess Roding','Essex','England','TL571112',557170,211283,51.77815,0.27685,70,'CM5 0','Epping Forest District','Eastern','Village');
`.run(pool)
}
