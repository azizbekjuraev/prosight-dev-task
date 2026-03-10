import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { LocusMemberEntity } from './locus-member.entity';

@Entity({ schema: 'rnacen', name: 'rnc_locus' })
export class LocusEntity {
  @PrimaryColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'assembly_id', type: 'text' })
  assemblyId: string;

  @Column({ name: 'locus_name', type: 'text' })
  locusName: string;

  @Column({ name: 'public_locus_name', type: 'text' })
  publicLocusName: string;

  @Column({ name: 'chromosome', type: 'text' })
  chromosome: string;

  @Column({ name: 'strand', type: 'text' })
  strand: string;

  @Column({ name: 'locus_start', type: 'int' })
  locusStart: number;

  @Column({ name: 'locus_stop', type: 'int' })
  locusStop: number;

  @Column({ name: 'member_count', type: 'int' })
  memberCount: number;

  @OneToMany(() => LocusMemberEntity, (locusMember) => locusMember.locus)
  locusMembers: LocusMemberEntity[];
}
