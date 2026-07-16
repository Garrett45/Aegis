using System;
using System.Collections.Generic;

namespace Api.Shared.EntityFrameworkCore.Models;

public partial class InitiativeList
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public string Name { get; set; } = null!;

    public int Round { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<InitiativeItem> InitiativeItems { get; set; } = new List<InitiativeItem>();
}
