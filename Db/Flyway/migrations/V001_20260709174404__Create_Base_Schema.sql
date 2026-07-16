create table account
(
    id                   int identity
        constraint account_pk
            primary key,
    identity_provider_id varchar(255)                          not null,
    first_name           varchar(255)                          not null,
    last_name            varchar(255)                          not null,
    created_at           datetime2(7) default sysutcdatetime() not null,
    updated_at           datetime2(7) default sysutcdatetime() not null
)
go

create table initiative_list
(
    id         int identity
        constraint initiative_list_pk
            primary key,
    account_id int                                   not null
        constraint initiative_list_account_id_fk
            references account,
    name       varchar(255)                          not null,
    round      int                                   not null,
    created_at           datetime2(7) default sysutcdatetime() not null,
    updated_at           datetime2(7) default sysutcdatetime() not null
)
go

create table initiative_list_item
(
    id            int identity
        constraint initiative_list_item_pk
            primary key,
    initiative_list_id int                                   not null
        constraint initiative_list_item_initiative_list_id_fk
            references initiative_list,
	initiative int,
    initiative_bonus int,
    name       varchar(255),
    hp         int,
    ac         int,
    is_active  bit                                           not null,
    sort_order int                                           not null
)
go