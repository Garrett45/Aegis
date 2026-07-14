create table account
(
    id                   int identity
        constraint account_pk
            primary key,
    identity_provider_id varchar(255)                          not null,
    first_name           varchar(255)                          not null,
    last_name            varchar(255)                          not null,
    created_at           datetime2(7) default sysutcdatetime() not null,
    updated_at           datetime2(7) default sysutcdatetime() not null,
    deleted_at           datetime2(7)
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
    initiative int,
    initiative_bonus int
    name       varchar(255)                          not null,
    hp         int,
    ac         int
)
go

create table to_do_item
(
    id            int identity
        constraint to_do_item_pk
            primary key,
    to_do_list_id int                                   not null
        constraint to_do_item_to_do_item_id_fk
            references to_do_item,
    description   varchar(255)                          not null,
    created_at    datetime2(7) default sysutcdatetime() not null,
    completed_at  datetime2(7),
    updated_at    datetime2(7) default sysutcdatetime() not null,
    deleted_at    datetime2(7)
)
go