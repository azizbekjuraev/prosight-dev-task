import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { LocusEntity } from './locus.entity';

@Entity({ schema: 'rnacen', name: 'rnc_locus_members' })
export class LocusMemberEntity {
  @PrimaryColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'urs_taxid', type: 'text' })
  ursTaxid: string;

  @Column({ name: 'region_id', type: 'int' })
  regionId: number;

  @Column({ name: 'locus_id', type: 'bigint' })
  locusId: string;

  @Column({ name: 'membership_status', type: 'text' })
  membershipStatus: string;

  @ManyToOne(() => LocusEntity, (locus) => locus.locusMembers, {
    eager: false,
  })
  @JoinColumn({ name: 'locus_id', referencedColumnName: 'id' })
  locus: LocusEntity;
}
