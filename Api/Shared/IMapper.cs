namespace Api.Shared;

public interface IMapper<in TOriginal, TMapped>
{
    public Task<TMapped> Map(TOriginal objectToMap);
}