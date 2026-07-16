using System;
using System.Collections.Generic;

namespace Api.Shared.EntityFrameworkCore.Models;

public partial class InitiativeItem
{
    public int Id { get; set; }

    public int InitiativeListId { get; set; }

    public int? Initiative { get; set; }

    public int? InitiativeBonus { get; set; }

    public string? Name { get; set; }

    public int? Hp { get; set; }

    public int? Ac { get; set; }

    public bool IsActive { get; set; }

    public int SortOrder { get; set; }

    public virtual InitiativeList InitiativeList { get; set; } = null!;
}
