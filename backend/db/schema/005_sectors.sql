-- +goose Up 
CREATE TABLE sectors (
  id UUID PRIMARY KEY NOT NULL ,
  name text NOT NULL UNIQUE
);

CREATE TABLE profile_sectors(
company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
PRIMARY KEY (company_id, sector_id)
);

-- +goose Down
DROP TABLE profile_sectors;
DROP TABLE sectors;

